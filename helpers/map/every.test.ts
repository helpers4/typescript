/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { every } from './every';

describe('every', () => {
  it('returns true when all entries match', () => {
    expect(every(new Map([['a', 1], ['b', 2]]), (v) => v > 0)).toBe(true);
  });

  it('returns false when at least one entry does not match', () => {
    expect(every(new Map([['a', 1], ['b', -2]]), (v) => v > 0)).toBe(false);
  });

  it('returns true (vacuously) for an empty map', () => {
    expect(every(new Map(), () => false)).toBe(true);
  });

  it('short-circuits after the first mismatch', () => {
    let calls = 0;
    every(new Map([['a', -1], ['b', 2], ['c', 3]]), (v) => {
      calls++;
      return v > 0;
    });
    expect(calls).toBe(1);
  });
});
