/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { safeReadJsonFile } from './safeReadJsonFile';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'safeReadJsonFile',
  category: 'node',
  examples: [
    {
      title: 'Read and parse a JSON file',
      description: 'Returns the parsed value when the file exists and contains valid JSON.',
      code: `safeReadJsonFile<{ name: string }>('./package.json')
// => { name: 'my-package', ... }`,
      assert: () => {
        const dir = mkdtempSync(join(tmpdir(), 'helpers4-example-'));
        try {
          const filePath = join(dir, 'package.json');
          writeFileSync(filePath, JSON.stringify({ name: 'my-package' }));
          const result = safeReadJsonFile<{ name: string }>(filePath);
          if (result?.name !== 'my-package') throw new Error("Expected { name: 'my-package' }");
        } finally {
          rmSync(dir, { recursive: true, force: true });
        }
      },
    },
    {
      title: 'Return null when the file is missing',
      description: 'Returns null instead of throwing when the file does not exist.',
      code: `safeReadJsonFile('./does-not-exist.json')
// => null`,
      assert: () => {
        if (safeReadJsonFile('./does-not-exist.json') !== null) throw new Error('Expected null');
      },
    },
    {
      title: 'Use a fallback value',
      description: 'Returns the provided fallback when the file is missing or invalid.',
      code: `safeReadJsonFile('./does-not-exist.json', {})
// => {}`,
      assert: () => {
        const result = safeReadJsonFile('./does-not-exist.json', {});
        if (Object.keys(result).length !== 0) throw new Error('Expected {}');
      },
    },
    {
      title: 'Also reads JSONC (comments + trailing commas)',
      description:
        'tsconfig.json/settings.json-style content — line/block comments and a trailing comma — parses too.',
      code: `safeReadJsonFile('./tsconfig.json')
// {
//   // enable strict type-checking
//   "compilerOptions": { "strict": true },
// }
// => { compilerOptions: { strict: true } }`,
      assert: () => {
        const dir = mkdtempSync(join(tmpdir(), 'helpers4-example-'));
        try {
          const filePath = join(dir, 'tsconfig.json');
          writeFileSync(
            filePath,
            '{\n  // enable strict type-checking\n  "compilerOptions": { "strict": true },\n}',
          );
          const result = safeReadJsonFile<{ compilerOptions: { strict: boolean } }>(filePath);
          if (result?.compilerOptions.strict !== true) throw new Error('Expected compilerOptions.strict === true');
        } finally {
          rmSync(dir, { recursive: true, force: true });
        }
      },
    },
  ],
};

export default examples;
