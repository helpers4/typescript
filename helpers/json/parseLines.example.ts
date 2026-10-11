/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parseLines } from './parseLines';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'parseLines',
  category: 'json',
  examples: [
    {
      title: 'Read NDJSON / JSON Lines',
      description: 'One JSON value per line; a trailing line break is optional.',
      code: `parseLines('{"id":1}\\n{"id":2}\\n')
// => [{ id: 1 }, { id: 2 }]`,
      assert: () => {
        const actual = parseLines('{"id":1}\n{"id":2}\n');
        const expected = [{ id: 1 }, { id: 2 }];
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      },
    },
    {
      title: 'Skip a truncated last line',
      description: 'With invalidLines: "skip", a line cut by a crash is dropped instead of failing the whole parse.',
      code: `parseLines('{"id":1}\\n{"id":', { invalidLines: 'skip' })
// => [{ id: 1 }]`,
      assert: () => {
        const actual = parseLines('{"id":1}\n{"id":', { invalidLines: 'skip' });
        const expected = [{ id: 1 }];
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      },
    },
    {
      title: 'Fail on an invalid line by default',
      description: 'The SyntaxError names the line.',
      code: `parseLines('1\\n{\\n3')
// throws SyntaxError: parseLines: line 2: ...`,
      assert: () => {
        let thrown: unknown;
        try { parseLines('1\n{\n3'); } catch (error) { thrown = error; }
        if (!(thrown instanceof SyntaxError)) throw new Error('Expected a SyntaxError');
      },
    },
  ],
};

export default examples;
