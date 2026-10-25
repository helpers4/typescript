/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import fs from 'fs-extra';
import { execFileSync } from 'node:child_process';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

/**
 * List every file path an `exports` target points to (a path, or a conditions object of paths).
 * @param target - The `exports` target
 * @returns The paths, relative to the package root
 */
function exportTargetPaths(target: unknown): string[] {
  if (typeof target === 'string') {
    return [target];
  }
  return Object.values(target as Record<string, unknown>).flatMap(exportTargetPaths);
}

/**
 * Assert that every `exports` target of a package resolves to a file on disk. A `*` target is
 * checked through its directory, which must exist and not be empty.
 * @param packageDir - The package directory
 * @param exportsField - Its `exports` field
 * @param keyPrefix - Only check the subpaths starting with this prefix
 * @returns The number of targets checked
 */
async function assertExportsExist(packageDir: string, exportsField: Record<string, unknown>, keyPrefix = './'): Promise<number> {
  let count = 0;
  for (const [subpath, target] of Object.entries(exportsField)) {
    if (!subpath.startsWith(keyPrefix)) {
      continue;
    }
    for (const relative of exportTargetPaths(target)) {
      const filePath = path.join(packageDir, relative.replace(/\*$/, ''));
      if (!await fs.pathExists(filePath)) {
        throw new Error(`${path.basename(packageDir)}: exports "${subpath}" points to missing ${relative}`);
      }
      if (relative.endsWith('*') && (await fs.readdir(filePath)).length === 0) {
        throw new Error(`${path.basename(packageDir)}: exports "${subpath}" points to an empty directory`);
      }
      count++;
    }
  }
  return count;
}

/**
 * Check the built `@helpers4/presets` package, and its copy inside the unified `helpers4`
 * package: version, files behind every export, valid JSON, and the `@helpers4/presets`
 * dependency of `helpers4` and peer dependency of `@helpers4/all`.
 */
export async function testPresetsPackage(): Promise<void> {
  console.log('  📋 Checking @helpers4/presets...');

  const root = process.cwd();
  const presetsDir = path.join(root, 'build', 'presets');
  const unifiedDir = path.join(root, 'build', 'helpers4');
  const bundleDir = path.join(root, 'build', 'all');
  const rootVersion = (await fs.readJson(path.join(root, 'package.json'))).version;

  for (const file of ['package.json', 'README.md', 'LICENSE.md']) {
    if (!await fs.pathExists(path.join(presetsDir, file))) {
      throw new Error(`Missing required file: ${file} in build/presets`);
    }
  }

  const presetsPackage = await fs.readJson(path.join(presetsDir, 'package.json'));
  if (presetsPackage.version !== rootVersion) {
    throw new Error(`Version mismatch: @helpers4/presets is ${presetsPackage.version}, root is ${rootVersion}`);
  }

  const presetsExports = await assertExportsExist(presetsDir, presetsPackage.exports);
  console.log(`  ✅ @helpers4/presets: ${presetsExports} export targets present`);

  for (const dir of [presetsDir, path.join(presetsDir, 'tsconfig'), path.join(presetsDir, 'oxlint')]) {
    for (const file of await fs.readdir(dir)) {
      if (file.endsWith('.json')) {
        await fs.readJson(path.join(dir, file));
      }
    }
  }
  console.log('  ✅ @helpers4/presets: every JSON file parses');

  const unifiedPackage = await fs.readJson(path.join(unifiedDir, 'package.json'));
  if (unifiedPackage.dependencies?.['@helpers4/presets'] !== rootVersion) {
    throw new Error('helpers4/package.json is missing (or version-mismatched) dependency on @helpers4/presets');
  }
  const unifiedExports = await assertExportsExist(unifiedDir, unifiedPackage.exports, './presets/');
  if (unifiedExports === 0) {
    throw new Error('helpers4/package.json exports no ./presets/ subpath');
  }
  console.log(`  ✅ helpers4/presets: ${unifiedExports} export targets present`);

  const bundlePackage = await fs.readJson(path.join(bundleDir, 'package.json'));
  if (bundlePackage.peerDependencies?.['@helpers4/presets'] !== rootVersion) {
    throw new Error('@helpers4/all is missing (or version-mismatched) peer dependency on @helpers4/presets');
  }
  console.log('  ✅ @helpers4/all: peer dependency on @helpers4/presets');
}

/**
 * Consume the built presets the way a project does, from a temporary directory whose
 * `node_modules` links to the build: tsc must resolve both `@helpers4/presets/…` and
 * `helpers4/presets/…` through `exports`, and oxlint must apply an extended preset.
 */
export async function testPresetsConsumption(): Promise<void> {
  console.log('  📋 Consuming the presets from a temporary project...');

  const root = process.cwd();
  const bin = (name: string) => path.join(root, 'node_modules', '.bin', name);
  const project = await mkdtemp(path.join(tmpdir(), 'helpers4-presets-'));

  try {
    await fs.ensureDir(path.join(project, 'node_modules', '@helpers4'));
    await fs.symlink(path.join(root, 'build', 'presets'), path.join(project, 'node_modules', '@helpers4', 'presets'));
    await fs.symlink(path.join(root, 'build', 'helpers4'), path.join(project, 'node_modules', 'helpers4'));
    await fs.outputFile(path.join(project, 'src', 'index.ts'), 'export const value: any = 1;\n');

    for (const preset of ['@helpers4/presets/tsconfig/lib.json', 'helpers4/presets/tsconfig/app.json']) {
      await fs.writeJson(path.join(project, 'tsconfig.json'), { extends: preset, include: ['src'] });
      const shown = JSON.parse(execFileSync(bin('tsc'), ['--showConfig'], { cwd: project, encoding: 'utf8' }));
      if (shown.compilerOptions?.strict !== true) {
        throw new Error(`tsc did not apply ${preset}: "strict" is not true`);
      }
      console.log(`  ✅ tsc extends ${preset}`);
    }

    await fs.writeJson(path.join(project, '.oxlintrc.json'), {
      extends: ['./node_modules/@helpers4/presets/oxlint/strict.json']
    });
    let lintFailed = false;
    try {
      execFileSync(bin('oxlint'), ['src'], { cwd: project, encoding: 'utf8', stdio: 'pipe' });
    } catch (error) {
      const output = String((error as { stdout?: string }).stdout ?? '');
      if (!output.includes('no-explicit-any')) {
        throw new Error(`oxlint failed for another reason than no-explicit-any:\n${output}`, { cause: error });
      }
      lintFailed = true;
    }
    if (!lintFailed) {
      throw new Error('oxlint accepted `any`: the extended strict preset was not applied');
    }
    console.log('  ✅ oxlint extends oxlint/strict.json');
  } finally {
    await fs.remove(project);
  }
}
