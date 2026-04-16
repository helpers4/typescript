/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { parse } from './parse';

const versionArb = fc.tuple(
  fc.nat({ max: 99 }),
  fc.nat({ max: 99 }),
  fc.nat({ max: 99 }),
).map(([major, minor, patch]) => `${major}.${minor}.${patch}`);

describe('parse — property-based', () => {
  it('major, minor, patch are non-negative integers', () => {
    fc.assert(
      fc.property(versionArb, (version: string) => {
        const result = parse(version);
        expect(result.major).toBeGreaterThanOrEqual(0);
        expect(result.minor).toBeGreaterThanOrEqual(0);
        expect(result.patch).toBeGreaterThanOrEqual(0);
        expect(Number.isInteger(result.major)).toBe(true);
        expect(Number.isInteger(result.minor)).toBe(true);
        expect(Number.isInteger(result.patch)).toBe(true);
      }),
    );
  });

  it('roundtrip: reassembled core version matches original', () => {
    fc.assert(
      fc.property(versionArb, (version: string) => {
        const result = parse(version);
        const reassembled = `${result.major}.${result.minor}.${result.patch}`;
        expect(reassembled).toBe(version);
      }),
    );
  });

  it('v-prefixed version parses the same major/minor/patch as without prefix', () => {
    fc.assert(
      fc.property(versionArb, (version: string) => {
        const withV = parse(`v${version}`);
        const without = parse(version);
        expect(withV.major).toBe(without.major);
        expect(withV.minor).toBe(without.minor);
        expect(withV.patch).toBe(without.patch);
      }),
    );
  });
});

describe('parse — contract', () => {
  it('"1.0.0" → {major:1, minor:0, patch:0, prerelease:[], build:[]}', () => {
    expect(parse('1.0.0')).toEqual({ major: 1, minor: 0, patch: 0, prerelease: [], build: [] });
  });

  it('"v2.3.4" → {major:2, minor:3, patch:4}', () => {
    const result = parse('v2.3.4');
    expect(result.major).toBe(2);
    expect(result.minor).toBe(3);
    expect(result.patch).toBe(4);
  });

  it('"1.0.0-alpha.1" → prerelease: ["alpha", "1"]', () => {
    expect(parse('1.0.0-alpha.1').prerelease).toEqual(['alpha', '1']);
  });

  it('"1.0.0+build.123" → build: ["build", "123"]', () => {
    expect(parse('1.0.0+build.123').build).toEqual(['build', '123']);
  });

  it('"1" → {major:1, minor:0, patch:0}', () => {
    const result = parse('1');
    expect(result.major).toBe(1);
    expect(result.minor).toBe(0);
    expect(result.patch).toBe(0);
  });

  it('null → null', () => {
    expect(parse(null)).toBeNull();
  });

  it('undefined → undefined', () => {
    expect(parse(undefined)).toBeUndefined();
  });

  it('"1.0.0-beta+exp.sha.5114f85" → prerelease and build parsed', () => {
    const result = parse('1.0.0-beta+exp.sha.5114f85');
    expect(result.prerelease).toEqual(['beta']);
    expect(result.build).toEqual(['exp', 'sha', '5114f85']);
  });
});
