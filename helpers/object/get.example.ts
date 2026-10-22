/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { get } from './get';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'get',
  category: 'object',
  examples: [
    {
      title: 'Access a nested property',
      description: 'Uses a dot-notated path to retrieve a deeply nested value.',
      code: `get({ a: { b: { c: 42 } } }, 'a.b.c')
// => 42`,
      assert: () => {
        const result = get({ a: { b: { c: 42 } } }, 'a.b.c');
        if (result !== 42) throw new Error(`Expected 42, got ${result}`);
      },
    },
    {
      title: 'Return default for missing path',
      description: 'Returns the default value when the path does not exist.',
      code: `get({ a: 1 }, 'b.c', 'default')
// => 'default'`,
      assert: () => {
        const result = get({ a: 1 }, 'b.c', 'default');
        if (result !== 'default') throw new Error(`Expected 'default', got ${result}`);
      },
    },
    {
      title: 'Get via key array (supports symbols)',
      description: 'Pass an explicit PropertyKey[] to bypass parsing. Supports string, number, and symbol keys.',
      code: `const id = Symbol('id')
get({ [id]: 'alice' }, [id])
// => 'alice'`,
      assert: () => {
        const id = Symbol('id');
        const result = get({ [id]: 'alice' } as Record<symbol, string>, [id]);
        if (result !== 'alice') throw new Error(`Expected 'alice', got ${String(result)}`);
      },
    },
  ],
};

export default examples;
