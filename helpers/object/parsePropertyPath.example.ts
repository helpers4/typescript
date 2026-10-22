/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { parsePropertyPath } from './parsePropertyPath';

const examples: HelperExamples = {
  helper: 'parsePropertyPath',
  category: 'object',
  examples: [
    {
      title: 'Parse a dot/bracket-notation path into key segments',
      description: 'The same notation accepted by get() and set() — bracket indices become numbers.',
      code: `parsePropertyPath('layers[1].name')
// => ['layers', 1, 'name']`,
      assert: () => {
        const result = parsePropertyPath('layers[1].name');
        if (JSON.stringify(result) !== JSON.stringify(['layers', 1, 'name'])) throw new Error('Unexpected segments');
      },
    },
    {
      title: 'Malformed paths throw instead of silently misparsing',
      description: "Text trailing a closing bracket within a segment is ambiguous — use 'a[0].b' instead.",
      code: `parsePropertyPath('a[0]b')
// => throws RangeError`,
      assert: () => {
        let threw = false;
        try {
          parsePropertyPath('a[0]b');
        } catch (e) {
          threw = e instanceof RangeError;
        }
        if (!threw) throw new Error('Expected a RangeError');
      },
    },
  ],
};

export default examples;
