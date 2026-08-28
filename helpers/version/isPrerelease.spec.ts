/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { parse } from './parse';
import { isPrerelease } from './isPrerelease';

const stableVersion = fc
  .tuple(fc.nat(99), fc.nat(99), fc.nat(99))
  .map(([major, minor, patch]) => `${major}.${minor}.${patch}`);

const prereleaseLabel = fc.constantFrom('alpha', 'beta', 'rc', 'next', 'canary');

const prereleaseVersion = fc
  .tuple(fc.nat(99), fc.nat(99), fc.nat(99), prereleaseLabel, fc.nat(20))
  .map(([major, minor, patch, label, n]) => `${major}.${minor}.${patch}-${label}.${n}`);

describe('isPrerelease — property-based (string)', () => {
  it('stable versions always return false', () => {
    fc.assert(
      fc.property(stableVersion, (v) => {
        expect(isPrerelease(v)).toBe(false);
      }),
    );
  });

  it('prerelease versions always return true', () => {
    fc.assert(
      fc.property(prereleaseVersion, (v) => {
        expect(isPrerelease(v)).toBe(true);
      }),
    );
  });
});

describe('isPrerelease — property-based (ParsedVersion)', () => {
  it('string and ParsedVersion forms always agree', () => {
    fc.assert(
      fc.property(fc.oneof(stableVersion, prereleaseVersion), (v) => {
        expect(isPrerelease(parse(v))).toBe(isPrerelease(v));
      }),
    );
  });

  it('ParsedVersion with empty prerelease array always returns false', () => {
    fc.assert(
      fc.property(
        fc.tuple(fc.nat(99), fc.nat(99), fc.nat(99)),
        ([major, minor, patch]) => {
          expect(isPrerelease({ scheme: 'semver', major, minor, patch, prerelease: [], build: [] })).toBe(false);
        },
      ),
    );
  });

  it('ParsedVersion with non-empty prerelease array always returns true', () => {
    fc.assert(
      fc.property(
        fc.tuple(fc.nat(99), fc.nat(99), fc.nat(99), fc.array(fc.string(), { minLength: 1 })),
        ([major, minor, patch, prerelease]) => {
          expect(isPrerelease({ scheme: 'semver', major, minor, patch, prerelease, build: [] })).toBe(true);
        },
      ),
    );
  });
});

describe('isPrerelease — contract', () => {
  it('return type is always boolean', () => {
    expect(typeof isPrerelease('1.0.0')).toBe('boolean');
    expect(typeof isPrerelease('1.0.0-alpha.1')).toBe('boolean');
    expect(typeof isPrerelease(parse('1.0.0'))).toBe('boolean');
  });
  it('undefined → undefined', () => expect(isPrerelease(undefined)).toBeUndefined());
  it('null → null', () => expect(isPrerelease(null)).toBeNull());
});
