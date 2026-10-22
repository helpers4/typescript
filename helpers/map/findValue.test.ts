/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { findValue } from './findValue';

describe('findValue', () => {
  it('returns the value of the first matching entry', () => {
    expect(findValue(new Map([['a', 1], ['b', 2], ['c', 3]]), (v) => v > 1)).toBe(2);
  });

  it('returns undefined when nothing matches', () => {
    expect(findValue(new Map([['a', 1]]), (v) => v > 10)).toBeUndefined();
  });

  it('returns undefined for an empty map', () => {
    expect(findValue(new Map(), () => true)).toBeUndefined();
  });
});
