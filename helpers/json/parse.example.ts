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
      description: 'JSON5 syntax such as single quotes is not JSONC, and throws a SyntaxError.',
      code: `parse("{'a': 1}")
// throws SyntaxError`,
      assert: () => {
        let thrown: unknown;
        try { parse("{'a': 1}"); } catch (error) { thrown = error; }
        if (!(thrown instanceof SyntaxError)) throw new Error('Expected a SyntaxError');
      },
    },
  ],
};

export default examples;
