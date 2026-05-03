/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { invert } from './invert';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'invert',
  category: 'object',
  examples: [
    {
      title: 'Swap keys and values',
      code: `invert({ a: 'x', b: 'y', c: 'z' })
// => { x: 'a', y: 'b', z: 'c' }`,
      assert: () => {
        const result = invert({ a: 'x', b: 'y', c: 'z' });
        if (result['x'] !== 'a' || result['y'] !== 'b') throw new Error('Unexpected result');
      },
    },
    {
      title: 'Build a reverse lookup map',
      description: 'Useful when you have a code-to-label map and need label-to-code.',
      code: `const STATUS_LABELS = { 200: 'OK', 404: 'Not Found', 500: 'Internal Server Error' };
const LABEL_TO_CODE = invert(STATUS_LABELS);

LABEL_TO_CODE['OK']; // => '200'`,
      assert: () => {
        const STATUS_LABELS: Record<number, string> = { 200: 'OK', 404: 'Not Found' };
        const LABEL_TO_CODE = invert(STATUS_LABELS);
        if (LABEL_TO_CODE['OK'] !== '200') throw new Error(`Expected '200'`);
      },
    },
  ],
};

export default examples;
