/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { safeParseStrict } from './safeParseStrict';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'safeParseStrict',
  category: 'json',
  examples: [
    {
      title: 'Parse without throwing',
      description: 'Returns null instead of throwing on invalid input.',
      code: `safeParseStrict('{"id":1}')  // => { id: 1 }
safeParseStrict('{"id":1,}') // => null`,
      assert: () => {
        if (safeParseStrict('{"id":1,}') !== null) throw new Error('Expected null');
        const actual = safeParseStrict('{"id":1}');
        const expected = { id: 1 };
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      },
    },
    {
      title: 'Provide a fallback',
      description: 'The fallback is returned on invalid input, so the result is never null.',
      code: `safeParseStrict('oops', { id: 0 })
// => { id: 0 }`,
      assert: () => {
        const actual = safeParseStrict('oops', { id: 0 });
        const expected = { id: 0 };
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      },
    },
  ],
};

export default examples;
