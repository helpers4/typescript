/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { countBy } from './countBy';

describe('countBy', () => {
  it('counts entries per derived group', () => {
    const map = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4]]);
    expect(countBy(map, (v) => (v % 2 === 0 ? 'even' : 'odd'))).toEqual(
      new Map([['odd', 2], ['even', 2]]),
    );
  });

  it('returns an empty map for an empty input', () => {
    expect(countBy(new Map(), (v: number) => v)).toEqual(new Map());
  });

  it('creates one group per distinct derived key', () => {
    const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
    expect(countBy(map, (v) => v)).toEqual(new Map([[1, 1], [2, 1], [3, 1]]));
  });
});
