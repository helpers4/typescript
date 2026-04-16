/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { compare } from './compare';

const versionArb = fc.tuple(
  fc.nat({ max: 9 }),
  fc.nat({ max: 9 }),
  fc.nat({ max: 9 }),
).map(([major, minor, patch]) => `${major}.${minor}.${patch}`);

describe('compare — property-based', () => {
  it('reflexive: compare(v, v) === 0', () => {
    fc.assert(
      fc.property(versionArb, (v: string) => {
        expect(compare(v, v)).toBe(0);
      }),
    );
  });

  it('antisymmetric: compare(a, b) === -compare(b, a)', () => {
    fc.assert(
      fc.property(versionArb, versionArb, (a: string, b: string) => {
        expect(compare(a, b)).toBe(-compare(b, a));
      }),
    );
  });

  it('transitive: if compare(a,b) <= 0 and compare(b,c) <= 0, then compare(a,c) <= 0', () => {
    fc.assert(
      fc.property(versionArb, versionArb, versionArb, (a: string, b: string, c: string) => {
        if (compare(a, b) <= 0 && compare(b, c) <= 0) {
          expect(compare(a, c)).toBeLessThanOrEqual(0);
        }
      }),
    );
  });
});

describe('compare — contract', () => {
  it('"1.0.0" vs "2.0.0" → -1', () => {
    expect(compare('1.0.0', '2.0.0')).toBe(-1);
  });

  it('"2.0.0" vs "1.0.0" → 1', () => {
    expect(compare('2.0.0', '1.0.0')).toBe(1);
  });

  it('"1.0.0" vs "1.0.0" → 0', () => {
    expect(compare('1.0.0', '1.0.0')).toBe(0);
  });

  it('"1.0.0-alpha" vs "1.0.0" → -1 (prerelease < release)', () => {
    expect(compare('1.0.0-alpha', '1.0.0')).toBe(-1);
  });

  it('"1.0.0+build1" vs "1.0.0+build2" → 0 (build metadata ignored)', () => {
    expect(compare('1.0.0+build1', '1.0.0+build2')).toBe(0);
  });

  it('"1.0.0-1" vs "1.0.0-2" → -1 (numeric comparison)', () => {
    expect(compare('1.0.0-1', '1.0.0-2')).toBe(-1);
  });

  it('"1.0.0-alpha" vs "1.0.0-beta" → -1 (lexical)', () => {
    expect(compare('1.0.0-alpha', '1.0.0-beta')).toBe(-1);
  });

  it('"1.0.0-1" vs "1.0.0-alpha" → -1 (numeric < alphanumeric)', () => {
    expect(compare('1.0.0-1', '1.0.0-alpha')).toBe(-1);
  });

  it('"1.0.0" vs "1.0.1" → -1 (patch)', () => {
    expect(compare('1.0.0', '1.0.1')).toBe(-1);
  });

  it('"1.1.0" vs "1.0.9" → 1 (minor)', () => {
    expect(compare('1.1.0', '1.0.9')).toBe(1);
  });

  it('v-prefix is handled: "v1.0.0" vs "1.0.0" → 0', () => {
    expect(compare('v1.0.0', '1.0.0')).toBe(0);
  });
});
