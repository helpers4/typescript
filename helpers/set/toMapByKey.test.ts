/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { toMapByKey } from './toMapByKey';

describe('toMapByKey', () => {
  it('indexes values by a derived key', () => {
    const set = new Set([{ id: 'a', n: 1 }, { id: 'b', n: 2 }]);
    expect(toMapByKey(set, (item) => item.id)).toEqual(
      new Map([['a', { id: 'a', n: 1 }], ['b', { id: 'b', n: 2 }]]),
    );
  });

  it('returns an empty map for an empty input', () => {
    expect(toMapByKey(new Set<never>(), (x) => x)).toEqual(new Map());
  });
});
