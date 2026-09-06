/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { UNKNOWN_FAMILY } from './_unknownFamily';
import { agree } from './agree';
import { families } from './families';

describe('agree — property-based', () => {
  it('never throws for arbitrary strings', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (a, b) => {
        expect(() => agree(a, b)).not.toThrow();
      }),
    );
  });

  it('is symmetric', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (a, b) => {
        expect(agree(a, b)).toBe(agree(b, a));
      }),
    );
  });

  it('is reflexive: a string always agrees with itself', () => {
    fc.assert(
      fc.property(fc.string(), (a) => {
        expect(agree(a, a)).toBe(true);
      }),
    );
  });

  it('always agrees whenever either side resolves to no known family', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (a, b) => {
        // Vacuously true for an empty set too — no known family is no known family either way.
        const aHasNoKnownFamily = [...families(a)].every((f) => f === UNKNOWN_FAMILY);
        const bHasNoKnownFamily = [...families(b)].every((f) => f === UNKNOWN_FAMILY);
        if (aHasNoKnownFamily || bHasNoKnownFamily) {
          expect(agree(a, b)).toBe(true);
        }
      }),
    );
  });
});

describe('agree — contract', () => {
  it('two disjoint compound expressions with no shared family conflict', () => {
    expect(agree('MIT AND BSD-3-Clause', 'Apache-2.0 AND GPL-3.0-only')).toBe(false);
  });
});
