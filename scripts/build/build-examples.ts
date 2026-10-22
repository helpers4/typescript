/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { DIR } from '../constants';
import { writeFile } from '../utils';
import type { CategoryExamplesJson, HelperExamples, SerializedHelperExamples } from '../examples/types';

/**
 * Generates an `examples.json` file in each built category directory.
 * Strips the `assert` functions, keeping only serializable metadata.
 *
 * @param validCategories - Categories that were successfully built
 */
export async function buildExamples(validCategories: string[]): Promise<void> {
  for (const category of validCategories) {
    const categoryPath = join(DIR.HELPERS, category);
    const files = await readdir(categoryPath);
    const exampleFiles = files.filter(f => f.endsWith('.example.ts')).sort();

    if (exampleFiles.length === 0) continue;

    const helpers: SerializedHelperExamples[] = [];

    for (const file of exampleFiles) {
      const filePath = join(process.cwd(), categoryPath, file);
      const mod = await import(filePath) as { default: HelperExamples };
      const helperExamples = mod.default;

      helpers.push({
        helper: helperExamples.helper,
        examples: helperExamples.examples.map(ex => ({
          title: ex.title,
          description: ex.description,
          code: ex.code,
        })),
      });
    }

    const json: CategoryExamplesJson = { category, helpers };
    const outputPath = join(DIR.BUILD, category, 'examples.json');
    writeFile(outputPath, JSON.stringify(json, null, 2));
  }
}
