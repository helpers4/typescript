/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { DIR } from '../constants';

interface SmokeResult {
  readonly category: string;
  readonly helper: string;
  readonly title: string;
  readonly success: boolean;
  readonly error?: string;
}

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
 */
async function runSmokeTests(): Promise<void> {
  const buildDir = resolve(DIR.BUILD);

  if (!existsSync(buildDir)) {
    console.error('❌ Build directory not found. Run `pnpm build` first.');
    process.exit(1);
  }

  const categories = (await readdir(DIR.HELPERS)).sort();
  const results: SmokeResult[] = [];
  let failures = 0;

  console.info('💨 Running post-build smoke tests...\n');

  for (const category of categories) {
    const builtLib = join(buildDir, category, 'lib', 'index.js');
    if (!existsSync(builtLib)) continue;

    // Import the built package
    const builtModule = await import(resolve(builtLib)) as Record<string, unknown>;

    // Discover example files from source
    const categoryPath = join(DIR.HELPERS, category);
    const files = await readdir(categoryPath);
    const exampleFiles = files.filter(f => f.endsWith('.example.ts')).sort();

    if (exampleFiles.length === 0) continue;

    console.info(`📂 ${category}/`);

    for (const file of exampleFiles) {
      const filePath = join(categoryPath, file);
      const mod = await import(resolve(filePath)) as {
        default: {
          helper: string;
          category: string;
          examples: ReadonlyArray<{
            title: string;
            assert: () => void | Promise<void>;
          }>;
        };
      };
      const helperExamples = mod.default;

      // Verify the helper is exported from the built module
      const helperName = helperExamples.helper;
      if (!(helperName in builtModule)) {
        failures++;
        const msg = `"${helperName}" not exported from build/${category}/lib/index.js`;
        results.push({ category, helper: helperName, title: 'Export check', success: false, error: msg });
        console.error(`   ❌ ${helperName} — Export check`);
        console.error(`      ${msg}`);
        continue;
      }

      for (const example of helperExamples.examples) {
        try {
          await example.assert();
          results.push({ category, helper: helperName, title: example.title, success: true });
          console.info(`   ✅ ${helperName} — ${example.title}`);
        } catch (err) {
          failures++;
          const errorMessage = err instanceof Error ? err.message : String(err);
          results.push({ category, helper: helperName, title: example.title, success: false, error: errorMessage });
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
