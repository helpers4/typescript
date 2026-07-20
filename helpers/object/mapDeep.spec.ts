/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { UNSAFE_KEYS } from '../_shared/_unsafeKeys';
import { mapDeep } from './mapDeep';

const safeKey = fc.string({ minLength: 1 }).filter((s) => !UNSAFE_KEYS.has(s));

describe('mapDeep — property-based', () => {
  it('identity transform preserves the object', () => {
    fc.assert(
      fc.property(fc.dictionary(safeKey, fc.integer()), (obj) => {
        expect(mapDeep(obj)).toEqual(obj);
      }),
    );
  });

  it('never produces more top-level keys than the input (collisions can only shrink it)', () => {
    fc.assert(
      fc.property(fc.dictionary(safeKey, fc.integer()), (obj) => {
        const result = mapDeep(obj, undefined, (k) => k.slice(0, 1)) as Record<string, unknown>;
        expect(Object.keys(result).length).toBeLessThanOrEqual(Object.keys(obj).length);
      }),
    );
  });
});

describe('mapDeep — contract', () => {
  it('empty object stays empty', () => {
    expect(mapDeep({})).toEqual({});
  });

  it('primitives pass through unchanged', () => {
    expect(mapDeep(42)).toBe(42);
    expect(mapDeep(null)).toBe(null);
  });
});
