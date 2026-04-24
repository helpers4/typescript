/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { parse } from './parse';
import { stringify } from './stringify';

const arbitraryVersion = fc
  .tuple(fc.nat(99), fc.nat(99), fc.nat(99))
  .map(([major, minor, patch]) => `${major}.${minor}.${patch}`);

const arbitraryPrereleaseVersion = fc
  .tuple(fc.nat(99), fc.nat(99), fc.nat(99), fc.constantFrom('alpha', 'beta', 'rc'), fc.nat(20))
  .map(([major, minor, patch, label, n]) => `${major}.${minor}.${patch}-${label}.${n}`);

describe('stringify — property-based', () => {
  it('round-trips stable versions through parse', () => {
    fc.assert(
      fc.property(arbitraryVersion, (v) => {
        expect(stringify(parse(v))).toBe(v);
      }),
    );
  });

  it('round-trips prerelease versions through parse', () => {
    fc.assert(
      fc.property(arbitraryPrereleaseVersion, (v) => {
        expect(stringify(parse(v))).toBe(v);
      }),
    );
  });

  it('result never starts with "v"', () => {
    fc.assert(
      fc.property(arbitraryVersion, (v) => {
        expect(stringify(parse(v))).not.toMatch(/^v/);
      }),
    );
  });

  it('stable version result contains no "-"', () => {
    fc.assert(
      fc.property(arbitraryVersion, (v) => {
        expect(stringify(parse(v))).not.toContain('-');
      }),
    );
  });
});

describe('stringify — contract', () => {
  it('null passthrough', () => expect(stringify(null)).toBeNull());
  it('undefined passthrough', () => expect(stringify(undefined)).toBeUndefined());
  it('result for stable version has format X.Y.Z', () => {
    expect(stringify({ major: 1, minor: 2, patch: 3, prerelease: [], build: [] })).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
