/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { compare } from './compare';
import { satisfiesRange } from './satisfiesRange';

const versionArb = fc.tuple(
  fc.nat({ max: 9 }),
  fc.nat({ max: 9 }),
  fc.nat({ max: 9 }),
).map(([major, minor, patch]) => `${major}.${minor}.${patch}`);

describe('satisfiesRange — property-based', () => {
  it('version always satisfies its own exact range', () => {
    fc.assert(
      fc.property(versionArb, (version: string) => {
        expect(satisfiesRange(version, version)).toBe(true);
      }),
    );
  });

  it('if satisfiesRange(v, ">1.0.0") is true then compare(v, "1.0.0") > 0', () => {
    fc.assert(
      fc.property(versionArb, (v: string) => {
        const satisfies = satisfiesRange(v, '>1.0.0');
        if (satisfies) {
          expect(compare(v, '1.0.0')).toBeGreaterThan(0);
        }
      }),
    );
  });

  it('if satisfiesRange(v, ">=X.Y.Z") is true then compare(v, X.Y.Z) >= 0', () => {
    fc.assert(
      fc.property(versionArb, versionArb, (v: string, base: string) => {
        const satisfies = satisfiesRange(v, `>=${base}`);
        if (satisfies) {
          expect(compare(v, base)).toBeGreaterThanOrEqual(0);
        }
      }),
    );
  });
});

describe('satisfiesRange — contract', () => {
  it('"1.5.0" satisfies "^1.0.0"', () => {
    expect(satisfiesRange('1.5.0', '^1.0.0')).toBe(true);
  });

  it('"2.0.0" does not satisfy "^1.0.0"', () => {
    expect(satisfiesRange('2.0.0', '^1.0.0')).toBe(false);
  });

  it('exact: "1.0.0" satisfies "1.0.0"', () => {
    expect(satisfiesRange('1.0.0', '1.0.0')).toBe(true);
  });

  it('exact: "1.0.1" does not satisfy "1.0.0"', () => {
    expect(satisfiesRange('1.0.1', '1.0.0')).toBe(false);
  });

  it('"1.0.0" satisfies ">=1.0.0"', () => {
    expect(satisfiesRange('1.0.0', '>=1.0.0')).toBe(true);
  });

  it('"0.9.0" does not satisfy ">=1.0.0"', () => {
    expect(satisfiesRange('0.9.0', '>=1.0.0')).toBe(false);
  });

  it('"1.0.0" satisfies "<=1.0.0"', () => {
    expect(satisfiesRange('1.0.0', '<=1.0.0')).toBe(true);
  });

  it('"1.0.1" does not satisfy "<=1.0.0"', () => {
    expect(satisfiesRange('1.0.1', '<=1.0.0')).toBe(false);
  });

  it('"1.5.0" satisfies "~1.5.0"', () => {
    expect(satisfiesRange('1.5.0', '~1.5.0')).toBe(true);
  });

  it('"1.6.0" does not satisfy "~1.5.0" (minor changed)', () => {
    expect(satisfiesRange('1.6.0', '~1.5.0')).toBe(false);
  });

  it('"2.0.0" satisfies ">1.0.0"', () => {
    expect(satisfiesRange('2.0.0', '>1.0.0')).toBe(true);
  });

  it('"1.0.0" does not satisfy ">1.0.0"', () => {
    expect(satisfiesRange('1.0.0', '>1.0.0')).toBe(false);
  });
});
