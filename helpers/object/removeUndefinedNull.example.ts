/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { removeUndefinedNull } from './removeUndefinedNull';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'removeUndefinedNull',
  category: 'object',
  examples: [
    {
      title: 'Strip null and undefined values',
      description: 'Returns a shallow copy of the object without null or undefined properties.',
      code: `removeUndefinedNull({ a: 1, b: null, c: undefined, d: 'ok' })
// => { a: 1, d: 'ok' }`,
      assert: () => {
        const result = removeUndefinedNull({ a: 1, b: null, c: undefined, d: 'ok' });
        if (result === null || result === undefined) throw new Error('Expected an object');
        if ('b' in result || 'c' in result) throw new Error('null/undefined values should be removed');
        if (result.a !== 1 || result.d !== 'ok') throw new Error('Valid values should be preserved');
      },
    },
  ],
};

export default examples;
