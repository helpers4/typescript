/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { mkdtemp, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { DIR } from '../constants';
import { listHelperCategories } from '../utils';

interface SmokeResult {
  readonly category: string;
  readonly helper: string;
  readonly title: string;
  readonly success: boolean;
  readonly error?: string;
}

/**
 * Deep, real-execution checks per category, run against the already-imported built module.
 *
 * The per-example loop below only proves the built module *exports* the right name — each
 * example's `assert()` closure still calls the function captured from its own source-level
 * `import { x } from './x'`, never the compiled one, so it can't catch a function that exists
 * but misbehaves once actually invoked from build/. That gap is exactly how @helpers4/node's
 * safeReadJsonFile and withTempDir shipped silently broken for a full release: a Rollup
 * `external` misconfiguration made Vite substitute their Node builtin imports with a stub that
 * throws (or, for safeReadJsonFile, gets swallowed into its own try/catch and just returns the
 * fallback) — every check "passed" because none of them ever called the compiled function.
 *
 * Kept as an explicit, short per-category list rather than a generic mechanism: this risk only
 * applies to categories that import something external, which today is just `node` (Node
 * builtins) — `observable`'s `rxjs` externalization has been correctly configured from the
 * start. Add a case here if another category picks up that same risk.
 */
const DEEP_CHECKS: Record<string, (builtModule: Record<string, unknown>) => Promise<void>> = {
  async node(builtModule) {
    const safeReadJsonFile = builtModule.safeReadJsonFile as (path: string, fallback?: unknown) => unknown;
    const withTempDirFn = builtModule.withTempDir as <T>(prefix: string, fn: (dir: string) => Promise<T>) => Promise<T>;

    const dir = await mkdtemp(join(tmpdir(), 'helpers4-smoke-'));
    try {
      const filePath = join(dir, 'probe.json');
      await writeFile(filePath, JSON.stringify({ smoke: true }));
      const result = safeReadJsonFile(filePath) as { smoke?: boolean } | null;
      if (result === null || result.smoke !== true) {
        throw new Error(
          `safeReadJsonFile returned ${JSON.stringify(result)} for a file that exists — ` +
          'node:fs likely got bundled into a stub instead of staying external.',
        );
      }
    } finally {
      await rm(dir, { recursive: true, force: true });
    }

    let receivedDir = '';
    const dirExistedDuringRun = await withTempDirFn('smoke', async (d: string) => {
      receivedDir = d;
      return existsSync(d);
    });
    if (dirExistedDuringRun !== true) {
      throw new Error('withTempDir: the directory did not exist while fn ran');
    }
    if (existsSync(receivedDir)) {
      throw new Error('withTempDir: the directory was not removed after fn resolved');
    }
  },
};

/**
 * Post-build smoke tests.
 *
 * For each category, dynamically imports the **built** package
 * (`build/<category>/lib/index.js`) and re-runs every `.example.ts`
 * assertion against it — replacing the source-level import with the
 * compiled export.
 *
 * This validates that:
 * 1. The build output is importable
 * 2. All exported functions exist
 * 3. All assertions still pass against compiled code
 * 4. For categories in DEEP_CHECKS: the compiled functions actually behave correctly when
 *    really invoked, not just "exists and doesn't throw on import"
 */
async function runSmokeTests(): Promise<void> {
  const buildDir = resolve(DIR.BUILD);

  if (!existsSync(buildDir)) {
    console.error('❌ Build directory not found. Run `pnpm build` first.');
    process.exit(1);
  }

  const categories = await listHelperCategories(DIR.HELPERS);
  const results: SmokeResult[] = [];
  let failures = 0;

  console.info('💨 Running post-build smoke tests...\n');

  for (const category of categories) {
    const builtLib = join(buildDir, category, 'lib', 'index.js');
    if (!existsSync(builtLib)) {continue;}

    // Import the built package
    const builtModule = await import(resolve(builtLib)) as Record<string, unknown>;

    // Discover example files from source
    const categoryPath = join(DIR.HELPERS, category);
    const files = await readdir(categoryPath);
    const exampleFiles = files.filter(f => f.endsWith('.example.ts')).toSorted();

    const deepCheck = DEEP_CHECKS[category];
    if (exampleFiles.length === 0 && !deepCheck) {continue;}

    console.info(`📂 ${category}/`);

    if (deepCheck) {
      try {
        await deepCheck(builtModule);
        results.push({ category, helper: category, success: true, title: 'Deep execution check' });
        console.info(`   ✅ ${category} — Deep execution check`);
      } catch (error) {
        failures++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.push({ category, error: errorMessage, helper: category, success: false, title: 'Deep execution check' });
        console.error(`   ❌ ${category} — Deep execution check`);
        console.error(`      ${errorMessage}`);
      }
    }

    for (const file of exampleFiles) {
      const filePath = join(categoryPath, file);
      const mod = await import(resolve(filePath)) as {
        default: {
          helper: string;
          category: string;
          examples: readonly {
            title: string;
            assert: () => void | Promise<void>;
          }[];
        };
      };
      const helperExamples = mod.default;

      // Verify the helper is exported from the built module
      const helperName = helperExamples.helper;
      if (!(helperName in builtModule)) {
        failures++;
        const msg = `"${helperName}" not exported from build/${category}/lib/index.js`;
        results.push({ category, error: msg, helper: helperName, success: false, title: 'Export check' });
        console.error(`   ❌ ${helperName} — Export check`);
        console.error(`      ${msg}`);
        continue;
      }

      for (const example of helperExamples.examples) {
        try {
          await example.assert();
          results.push({ category, helper: helperName, success: true, title: example.title });
          console.info(`   ✅ ${helperName} — ${example.title}`);
        } catch (error) {
          failures++;
          const errorMessage = error instanceof Error ? error.message : String(error);
          results.push({ category, error: errorMessage, helper: helperName, success: false, title: example.title });
          console.error(`   ❌ ${helperName} — ${example.title}`);
          console.error(`      ${errorMessage}`);
        }
      }
    }
  }

  const passed = results.length - failures;
  console.info(`\n${'─'.repeat(50)}`);
  console.info(`📊 Results: ${passed}/${results.length} passed`);

  if (failures > 0) {
    console.error(`\n❌ ${failures} smoke test(s) failed`);
    process.exit(1);
  } else {
    console.info('\n✅ All post-build smoke tests passed');
  }
}

runSmokeTests();
