/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import fs from 'fs-extra';
import path from 'node:path';
import { listHelperCategories } from '../../utils';

/** File suffixes that are not helper implementations */
export const SKIP_SUFFIXES = ['.test.ts', '.spec.ts', '.bench.ts', '.example.ts'];

/** Filenames that are never helper implementations */
export const SKIP_FILENAMES = new Set(['index.ts']);

export function isHelperSourceFile(filename: string): boolean {
  if (filename.startsWith('_')) return false;
  if (SKIP_FILENAMES.has(filename)) return false;
  for (const suffix of SKIP_SUFFIXES) {
    if (filename.endsWith(suffix)) return false;
  }
  return filename.endsWith('.ts');
}

/**
 * Check that every helper source file contains at least one `@since` JSDoc tag.
 * The expected value for new helpers is `@since next` (see CONTRIBUTING.md).
 */
export async function checkJsDocSince(): Promise<void> {
  console.log('  📋 Checking @since JSDoc tags in helper source files...');

  const helpersDir = path.resolve(process.cwd(), 'helpers');
  if (!await fs.pathExists(helpersDir)) {
    throw new Error('helpers/ directory not found.');
  }

  const errors: string[] = [];

  const categories = await listHelperCategories(helpersDir);
  for (const category of categories) {
    const categoryPath = path.join(helpersDir, category);

    const files = await fs.readdir(categoryPath);
    for (const filename of files) {
      if (!isHelperSourceFile(filename)) continue;

      const filePath = path.join(categoryPath, filename);
      const content = await fs.readFile(filePath, 'utf-8');
      const relative = path.relative(process.cwd(), filePath);

      const jsDocBlocks = [...content.matchAll(/\/\*\*[\s\S]*?\*\//g)];
      const hasSince = jsDocBlocks.some(([block]) => /@since\s+\S+/.test(block));
      if (!hasSince) {
        errors.push(`  ❌ Missing @since tag: ${relative}`);
      } else {
        console.log(`  ✅ ${relative}`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`JSDoc @since check failed:\n${errors.join('\n')}`);
  }

  console.log('  ✅ All helper source files have valid @since tags');
}
