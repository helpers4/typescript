#!/usr/bin/env node

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isHelperSourceFile } from '../coherency/jsdoc-since/helper';
import { listHelperCategories } from '../utils';
import { isPrerelease } from '../../helpers/version/isPrerelease';

/**
 * Inject the real version into every helper source file that carries `@since next`.
 *
 * Only called on stable releases — prerelease builds keep `@since next` so that
 * the tag retains its semantic meaning ("next stable release").
 *
 * @param version - The new stable version string (e.g. `2.1.0`).
 * @param dryRun  - When true, print what would change but write nothing.
 * @returns Absolute paths of files that were (or would be) modified.
 */
export async function injectSinceVersion(
  version: string,
  dryRun = false
): Promise<string[]> {
  if (isPrerelease(version)) {
    throw new Error(
      `injectSinceVersion must only be called for stable releases. Got: ${version}`
    );
  }

  console.log(`\n🔖 Step 3b: Injecting @since ${version} into helper files`);

  const helpersDir = path.resolve(process.cwd(), 'helpers');
  if (!await fs.pathExists(helpersDir)) {
    throw new Error('helpers/ directory not found.');
  }

  const modified: string[] = [];

  const categories = await listHelperCategories(helpersDir);
  for (const category of categories) {
    const categoryPath = path.join(helpersDir, category);

    const files = await fs.readdir(categoryPath);
    for (const filename of files) {
      if (!isHelperSourceFile(filename)) continue;

      const filePath = path.join(categoryPath, filename);
      const content = await fs.readFile(filePath, 'utf-8');

      if (!content.includes('@since next')) continue;

      const updated = content.replaceAll('@since next', `@since ${version}`);

      if (dryRun) {
        console.log(`  [DRY RUN] Would replace @since next → @since ${version} in ${path.relative(process.cwd(), filePath)}`);
      } else {
        await fs.writeFile(filePath, updated, 'utf-8');
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)}`);
      }

      modified.push(filePath);
    }
  }

  if (modified.length === 0) {
    console.log('  ℹ️  No files with @since next found — nothing to inject');
  } else {
    console.log(`✅ @since injection done (${modified.length} file(s) updated)`);
  }

  return modified;
}

// CLI entry point: tsx scripts/version/inject-since.ts <version> [--dry-run]
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const version = args.find(a => !a.startsWith('--'));
  const dryRun = args.includes('--dry-run');

  if (!version) {
    console.error('Usage: tsx scripts/version/inject-since.ts <version> [--dry-run]');
    process.exit(1);
  }

  if (isPrerelease(version)) {
    console.log(`ℹ️  Skipping @since injection — prerelease version (${version}), keeping @since next`);
    process.exit(0);
  }

  injectSinceVersion(version, dryRun).catch((err) => {
    console.error('❌', err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
