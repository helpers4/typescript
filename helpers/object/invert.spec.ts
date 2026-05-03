/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { invert } from './invert';

describe('invert — property-based', () => {
  it('inverted keys are the original values', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(fc.string({ maxLength: 5 }), { minLength: 1 }),
        fc.uniqueArray(fc.string({ maxLength: 5 }), { minLength: 1 }),
        (keys, values) => {
          const min = Math.min(keys.length, values.length);
          const obj = Object.fromEntries(keys.slice(0, min).map((k, i) => [k, values[i]])) as Record<string, string>;
          const inverted = invert(obj);
          for (const [k, v] of Object.entries(obj)) {
            expect(inverted[v]).toBe(k);
          }
        }
      )
    );
  });
});
