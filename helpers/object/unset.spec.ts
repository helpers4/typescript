/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { unset } from './unset';

const safeKey = fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]*$/);

describe('unset — property-based', () => {
  it('always returns the same object reference', () => {
    fc.assert(
      fc.property(safeKey, fc.anything(), (key, value) => {
        const obj: Record<string, unknown> = { [key]: value };
        expect(unset(obj, key)).toBe(obj);
      }),
    );
  });

  it('a removed top-level key no longer appears in Object.keys', () => {
    fc.assert(
      fc.property(safeKey, fc.anything(), (key, value) => {
        const obj: Record<string, unknown> = { [key]: value, other: 'x' };
        unset(obj, key);
        expect(Object.keys(obj)).not.toContain(key);
      }),
    );
  });

  it('unrelated keys are never affected', () => {
    fc.assert(
      fc.property(safeKey, safeKey, fc.anything(), (key, otherKey, value) => {
        fc.pre(key !== otherKey);
        const obj: Record<string, unknown> = { [key]: value, [otherKey]: 'kept' };
        unset(obj, key);
        expect(obj[otherKey]).toBe('kept');
      }),
    );
  });

  it('unsetting a non-existent path never throws', () => {
    fc.assert(
      fc.property(fc.array(safeKey, { minLength: 1, maxLength: 4 }), (keys) => {
        expect(() => unset({}, keys)).not.toThrow();
      }),
    );
  });
});
