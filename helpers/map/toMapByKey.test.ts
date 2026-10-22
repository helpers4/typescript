/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { toMapByKey } from './toMapByKey';

describe('toMapByKey', () => {
  it('indexes items by a derived key', () => {
    const items = [{ id: 'a', n: 1 }, { id: 'b', n: 2 }];
    expect(toMapByKey(items, (item) => item.id)).toEqual(
      new Map([['a', { id: 'a', n: 1 }], ['b', { id: 'b', n: 2 }]]),
    );
  });

  it('last item wins on key collision', () => {
    const items = [{ id: 'a', n: 1 }, { id: 'a', n: 2 }];
    expect(toMapByKey(items, (item) => item.id).get('a')).toEqual({ id: 'a', n: 2 });
  });

  it('returns an empty map for an empty input', () => {
    expect(toMapByKey([], (x: never) => x)).toEqual(new Map());
  });

  it('works with any iterable, not just arrays', () => {
    function* gen() {
      yield 1;
      yield 2;
    }
    expect(toMapByKey(gen(), (n) => n * 10)).toEqual(new Map([[10, 1], [20, 2]]));
  });
});
