/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { get } from '@helpers4/object';
import { RUN, consume } from '../../scripts/bench';

const obj = { a: { b: { c: 42 } } };
const withArray = { layers: [{ name: 'bg' }, { name: 'fg' }] };

test('get', async ({ bench }) => {
  await bench.compare(
    bench('shallow key array path', () => {
      consume(get(obj, ['a', 'b', 'c']));
    }),
    bench('dot-notation string path (parsed + cached)', () => {
      consume(get(obj, 'a.b.c'));
    }),
    bench('bracket-notation path into array', () => {
      consume(get(withArray, 'layers[1].name'));
    }),
    bench('missing path with default', () => {
      consume(get(obj, 'x.y.z', 'default'));
    }),
    RUN,
  );
});
