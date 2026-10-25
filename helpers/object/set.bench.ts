/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { set } from '@helpers4/object';
import { RUN, consume } from '../../scripts/bench';

test('set', async ({ bench }) => {
  await bench.compare(
    bench('shallow key array path, existing structure', () => {
      consume(set({ a: { b: { c: 1 } } }, ['a', 'b', 'c'], 42));
    }),
    bench('dot-notation path, existing structure', () => {
      consume(set({ a: { b: { c: 1 } } }, 'a.b.c', 42));
    }),
    bench('dot-notation path, creating intermediate objects', () => {
      consume(set({}, 'a.b.c.d.e', 42));
    }),
    bench('bracket-notation path into existing array', () => {
      consume(set({ layers: [{ name: 'bg' }, { name: 'fg' }] }, 'layers[1].name', 'updated'));
    }),
    RUN,
  );
});
