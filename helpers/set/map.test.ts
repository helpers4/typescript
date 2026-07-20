/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { map } from './map';

describe('map', () => {
  it('transforms every value', () => {
    expect(map(new Set([1, 2, 3]), (v) => v * 10)).toEqual(new Set([10, 20, 30]));
  });

  it('collapses duplicates produced by the transform', () => {
    expect(map(new Set([1, 2, 3]), () => 'same')).toEqual(new Set(['same']));
  });

  it('returns an empty set for an empty input', () => {
    expect(map(new Set<number>(), (v) => v)).toEqual(new Set());
  });
});
