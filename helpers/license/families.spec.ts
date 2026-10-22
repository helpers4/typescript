/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { families } from './families';

describe('families — property-based', () => {
  it('never throws for an arbitrary string', () => {
    fc.assert(
      fc.property(fc.string(), (raw) => {
        expect(() => families(raw)).not.toThrow();
      }),
    );
  });

  it('is case-insensitive: upper/lower/mixed case of the same string yield the same result', () => {
    fc.assert(
      fc.property(fc.string(), (raw) => {
        const result = families(raw);
        expect(families(raw.toUpperCase())).toEqual(result);
        expect(families(raw.toLowerCase())).toEqual(result);
      }),
    );
  });

  it('is idempotent on whitespace: leading/trailing padding never changes the result', () => {
    fc.assert(
      fc.property(fc.string(), fc.string({ unit: fc.constantFrom(' ', '\t') }), (raw, padding) => {
        expect(families(`${padding}${raw}${padding}`)).toEqual(families(raw));
      }),
    );
  });
});

describe('families — contract', () => {
  it('mixes a known and an unknown token in a compound expression', () => {
    expect(families('custom AND MIT')).toEqual(new Set(['unknown', 'mit']));
  });

  it('handles a string of only whitespace as empty', () => {
    expect(families('   ')).toEqual(new Set());
  });

  it('handles repeated identical tokens without duplicating the family (Set semantics)', () => {
    expect(families('MIT AND MIT')).toEqual(new Set(['mit']));
  });
});
