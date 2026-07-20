/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { findKey } from './findKey';

describe('findKey', () => {
  it('returns the key of the first matching entry', () => {
    expect(findKey(new Map([['a', 1], ['b', 2], ['c', 3]]), (v) => v > 1)).toBe('b');
  });

  it('returns undefined when nothing matches', () => {
    expect(findKey(new Map([['a', 1]]), (v) => v > 10)).toBeUndefined();
  });

  it('returns undefined for an empty map', () => {
    expect(findKey(new Map(), () => true)).toBeUndefined();
  });
});
