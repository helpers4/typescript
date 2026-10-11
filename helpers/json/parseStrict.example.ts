/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parseStrict } from './parseStrict';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'parseStrict',
  category: 'json',
  examples: [
    {
      title: 'Parse strict JSON',
      description: 'Exactly what JSON.parse accepts, typed with a generic.',
      code: `parseStrict<{ id: number }>('{"id":1}')
// => { id: 1 }`,
      assert: () => {
        const actual = parseStrict<{ id: number }>('{"id":1}');
        const expected = { id: 1 };
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      },
    },
    {
      title: 'Reject anything that is not strict JSON',
      description: 'Comments and trailing commas throw a SyntaxError: use it to validate an API payload.',
      code: `parseStrict('{"id":1,}')
// throws SyntaxError`,
      assert: () => {
        let thrown: unknown;
        try { parseStrict('{"id":1,}'); } catch (error) { thrown = error; }
        if (!(thrown instanceof SyntaxError)) throw new Error('Expected a SyntaxError');
      },
    },
  ],
};

export default examples;
