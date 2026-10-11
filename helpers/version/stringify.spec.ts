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
    expect(stringify({ scheme: 'semver', major: 1, minor: 2, patch: 3, prerelease: [], build: [] })).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

describe('stringify (debian) — property-based', () => {
  it('round-trips: stringify(parse(v, "debian")) === v for a canonical debian version', () => {
    const canonical = fc
      .tuple(fc.nat({ max: 5 }), fc.stringMatching(/^[0-9][A-Za-z0-9.+~-]{0,8}$/), fc.option(fc.stringMatching(/^[A-Za-z0-9.+~]{1,6}$/), { nil: undefined }))
      // A trailing "-" in the upstream part would read as an (invalid) empty revision when no revision follows.
      .filter(([, upstream, revision]) => revision !== undefined || !upstream.includes('-'))
      .map(([epoch, upstream, revision]) => `${epoch > 0 ? `${epoch}:` : ''}${upstream}${revision === undefined ? '' : `-${revision}`}`);
    fc.assert(fc.property(canonical, (v) => {
      expect(stringify(parse(v, 'debian'))).toBe(v);
    }));
  });
});

