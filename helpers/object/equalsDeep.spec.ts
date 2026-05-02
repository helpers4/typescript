/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { equalsDeep } from './equalsDeep';

describe('object/equalsDeep — property-based', () => {
  it('reflexive: equalsDeep(obj, obj) === true', () => {
    fc.assert(
      fc.property(
        fc.record({ a: fc.integer(), b: fc.string() }),
        (obj) => {
          expect(equalsDeep(obj, obj)).toBe(true);
        },
      ),
    );
  });

  it('clones are deeply equal', () => {
    fc.assert(
      fc.property(
        fc.record({ a: fc.integer(), b: fc.string() }),
        (obj) => {
          expect(equalsDeep(obj, { ...obj })).toBe(true);
        },
      ),
    );
  });

  it('symmetric: equalsDeep(a, b) === equalsDeep(b, a)', () => {
    fc.assert(
      fc.property(
        fc.record({ a: fc.integer() }),
        fc.record({ a: fc.integer() }),
        (a, b) => {
          expect(equalsDeep(a, b)).toBe(equalsDeep(b, a));
        },
      ),
    );
  });
});
