/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { UNKNOWN_FAMILY } from './_unknownFamily';
import { families } from './families';
import { isKnown } from './isKnown';

describe('isKnown — property-based', () => {
  it('never throws for an arbitrary string', () => {
    fc.assert(
      fc.property(fc.string(), (raw) => {
        expect(() => isKnown(raw)).not.toThrow();
      }),
    );
  });

  it('agrees with families(): true iff at least one resolved family is not the unknown sentinel', () => {
    fc.assert(
      fc.property(fc.string(), (raw) => {
        const expected = [...families(raw)].some((f) => f !== UNKNOWN_FAMILY);
        expect(isKnown(raw)).toBe(expected);
      }),
    );
  });
});

describe('isKnown — contract', () => {
  it('returns false for a string of only whitespace', () => {
    expect(isKnown('   ')).toBe(false);
  });
});
