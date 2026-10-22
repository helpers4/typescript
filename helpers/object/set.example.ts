/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { set } from './set';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'set',
  category: 'object',
  examples: [
    {
      title: 'Set a nested property (dot notation)',
      description: 'Creates intermediate objects as needed. All segments are string keys — including numeric-looking ones like "1".',
      code: `set({}, 'a.b.c', 42)
// => { a: { b: { c: 42 } } }

set({}, 'layers.1.name', 'bg')
// => { layers: { '1': { name: 'bg' } } }   // '1' is a string key`,
      assert: () => {
        const r1 = set({}, 'a.b.c', 42);
        if ((r1 as { a: { b: { c: number } } }).a?.b?.c !== 42) throw new Error('Unexpected result');

        const r2 = set({}, 'layers.1.name', 'bg');
        const layers = (r2 as Record<string, unknown>)['layers'] as Record<string, unknown>;
        if ((layers['1'] as Record<string, unknown>)['name'] !== 'bg') throw new Error('Expected string key "1"');
      },
    },
    {
      title: 'Set via bracket notation',
      description: 'Square-bracket indices become numeric keys. Useful when the path targets an array element.',
      code: `const obj = { layers: [{}, { name: 'old' }] }
set(obj, 'layers[1].name', 'new')
// => { layers: [{}, { name: 'new' }] }`,
      assert: () => {
        const obj = { layers: [{} as Record<string, unknown>, { name: 'old' }] };
        set(obj, 'layers[1].name', 'new');
        if (obj.layers[1].name !== 'new') throw new Error('Expected new');
      },
    },
    {
      title: 'Set via key array (supports symbols)',
      description: 'Pass an explicit PropertyKey[] to bypass parsing. Supports string, number, and symbol keys.',
      code: `const id = Symbol('id')
set({}, ['user', id], 'alice')
// => { user: { [id]: 'alice' } }`,
      assert: () => {
        const id = Symbol('id');
        const result = set({}, ['user', id], 'alice');
        const user = (result as Record<string, unknown>)['user'] as Record<symbol, unknown>;
        if (user[id] !== 'alice') throw new Error('Expected alice');
      },
    },
  ],
};

export default examples;
