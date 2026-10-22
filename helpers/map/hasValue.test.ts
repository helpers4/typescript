/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { hasValue } from './hasValue';

describe('hasValue', () => {
  it('returns true when the value is present', () => {
    expect(hasValue(new Map([['a', 1], ['b', 2]]), 2)).toBe(true);
  });

  it('returns false when the value is absent', () => {
    expect(hasValue(new Map([['a', 1]]), 99)).toBe(false);
  });

  it('returns false for an empty map', () => {
    expect(hasValue(new Map(), 1)).toBe(false);
  });

  it('matches NaN to NaN', () => {
    expect(hasValue(new Map([['a', Number.NaN]]), Number.NaN)).toBe(true);
  });

  it('does not consider keys, only values', () => {
    const map = new Map([['target', 'other-value']]);
    expect(hasValue(map, 'target')).toBe(false);
  });
});
