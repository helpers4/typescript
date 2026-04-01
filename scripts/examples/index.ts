/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { DIR } from '../constants';
import type { HelperExamples } from './types';

interface ExampleResult {
  readonly helper: string;
  readonly category: string;
  readonly title: string;
  readonly success: boolean;
  readonly error?: string;
}

/**
 * Discovers and runs all `.example.ts` files in the helpers directory.
 * Each example file must export a default `HelperExamples` object.
 *
 * Exit code 0 = all assertions passed, 1 = at least one failure.
 */
async function runExamples(): Promise<void> {
  const categories = (await readdir(DIR.HELPERS)).sort();
  const results: ExampleResult[] = [];
  let failures = 0;

  console.info('🧪 Running example smoke tests...\n');

  for (const category of categories) {
    const categoryPath = join(DIR.HELPERS, category);
    const files = await readdir(categoryPath);
    const exampleFiles = files.filter(f => f.endsWith('.example.ts')).sort();

    if (exampleFiles.length === 0) continue;

    console.info(`📂 ${category}/`);

    for (const file of exampleFiles) {
      const filePath = join(categoryPath, file);
      const mod = await import(join(process.cwd(), filePath)) as { default: HelperExamples };
      const helperExamples = mod.default;

      for (const example of helperExamples.examples) {
        try {
          await example.assert();
          results.push({
            helper: helperExamples.helper,
            category: helperExamples.category,
            title: example.title,
            success: true,
          });
          console.info(`   ✅ ${helperExamples.helper} — ${example.title}`);
        } catch (err) {
          failures++;
          const errorMessage = err instanceof Error ? err.message : String(err);
          results.push({
            helper: helperExamples.helper,
            category: helperExamples.category,
            title: example.title,
            success: false,
            error: errorMessage,
          });
          console.error(`   ❌ ${helperExamples.helper} — ${example.title}`);
          console.error(`      ${errorMessage}`);
        }
      }
    }
  }

  // Summary
  const passed = results.length - failures;
  console.info(`\n${'─'.repeat(50)}`);
  console.info(`📊 Results: ${passed}/${results.length} passed`);

  if (failures > 0) {
    console.error(`\n❌ ${failures} example(s) failed`);
    process.exit(1);
  } else {
    console.info('\n✅ All examples passed');
  }
}

runExamples();
