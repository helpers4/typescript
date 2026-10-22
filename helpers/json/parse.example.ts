/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parse } from './parse';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'parse',
  category: 'json',
  examples: [
    {
      title: 'Parse a config file with comments',
      description: 'Reads JSONC — the tsconfig.json / settings.json dialect — as well as strict JSON.',
      code: `parse(\`{
  // where the build goes
  "outDir": "dist",
}\`)
// => { outDir: 'dist' }`,
      assert: () => {
        const actual = parse('{\n  // where the build goes\n  "outDir": "dist",\n}');
        const expected = { outDir: 'dist' };
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      },
    },
    {
      title: 'Invalid input throws',
      description: 'The SyntaxError names the line and column of the problem.',
      code: `parse('{ my-key: 1 }')
// throws SyntaxError: a key with a dash needs quotes`,
      assert: () => {
        let thrown: unknown;
        try { parse('{ my-key: 1 }'); } catch (error) { thrown = error; }
        if (!(thrown instanceof SyntaxError)) throw new Error('Expected a SyntaxError');
      },
    },
    {
      title: 'Parse JSON5',
      description: 'Unquoted keys, single quotes, hexadecimal and leading-dot numbers, trailing commas.',
      code: `parse("{ name: 'app', retries: 0x3, ratio: .5, }")
// => { name: 'app', retries: 3, ratio: 0.5 }`,
      assert: () => {
        const actual = parse("{ name: 'app', retries: 0x3, ratio: .5, }");
        const expected = { name: 'app', retries: 3, ratio: 0.5 };
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      },
    },
  ],
};

export default examples;
