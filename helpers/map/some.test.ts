/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { some } from './some';

describe('some', () => {
  it('returns true when at least one entry matches', () => {
    expect(some(new Map([['a', 1], ['b', 2]]), (v) => v > 1)).toBe(true);
  });

  it('returns false when no entry matches', () => {
    expect(some(new Map([['a', 1], ['b', 2]]), (v) => v > 10)).toBe(false);
  });

  it('returns false for an empty map', () => {
    expect(some(new Map(), () => true)).toBe(false);
  });

  it('short-circuits after the first match', () => {
    let calls = 0;
    some(new Map([['a', 1], ['b', 2], ['c', 3]]), (v) => {
      calls++;
      return v === 1;
    });
    expect(calls).toBe(1);
  });
});
