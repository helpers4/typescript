/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { map } from './map';

const plainObject = fc.dictionary(
  fc.string({ minLength: 1, maxLength: 6 }),
  fc.integer()
);

describe('map — property-based', () => {
  it('output has same number of keys as input (no collision)', () => {
    fc.assert(
      fc.property(plainObject, (obj) => {
        const result = map(obj as Record<string, number>);
        expect(Object.keys(result)).toHaveLength(Object.keys(obj).length);
      })
    );
  });

  it('values are correctly transformed', () => {
    fc.assert(
      fc.property(plainObject, (obj) => {
        const result = map(obj as Record<string, number>, v => v * 2);
        for (const [k, v] of Object.entries(obj)) {
          expect(result[k as string]).toBe(v * 2);
        }
      })
    );
  });

  it('identity mapValue preserves all values', () => {
    fc.assert(
      fc.property(plainObject, (obj) => {
        const result = map(obj as Record<string, number>, v => v);
        expect(result).toEqual(obj);
      })
    );
  });
});
