/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isPrerelease } from './isPrerelease';
import { parse } from './parse';

describe('isPrerelease — string input', () => {
  it('alpha prerelease → true', () => expect(isPrerelease('2.0.0-alpha.1')).toBe(true));
  it('beta prerelease → true', () => expect(isPrerelease('1.0.0-beta.0')).toBe(true));
  it('rc prerelease → true', () => expect(isPrerelease('3.0.0-rc.2')).toBe(true));
  it('arbitrary prerelease label → true', () => expect(isPrerelease('1.0.0-next')).toBe(true));
  it('stable 1.0.0 → false', () => expect(isPrerelease('1.0.0')).toBe(false));
  it('stable 2.1.3 → false', () => expect(isPrerelease('2.1.3')).toBe(false));
  it('stable 0.0.1 → false', () => expect(isPrerelease('0.0.1')).toBe(false));
  it('v-prefixed stable → false', () => expect(isPrerelease('v1.0.0')).toBe(false));
  it('v-prefixed prerelease → true', () => expect(isPrerelease('v1.0.0-alpha.3')).toBe(true));
  it('stable with build metadata containing dash → false', () => expect(isPrerelease('1.0.0+build-123')).toBe(false));
  it('stable with build metadata → false', () => expect(isPrerelease('2.0.0+build.1')).toBe(false));
});

describe('isPrerelease — ParsedVersion input', () => {
  it('parse(alpha) → true', () => expect(isPrerelease(parse('2.0.0-alpha.1'))).toBe(true));
  it('parse(beta) → true', () => expect(isPrerelease(parse('1.0.0-beta.0'))).toBe(true));
  it('parse(rc) → true', () => expect(isPrerelease(parse('3.0.0-rc.2'))).toBe(true));
  it('parse(stable) → false', () => expect(isPrerelease(parse('1.0.0'))).toBe(false));
  it('parse(stable with build) → false', () => expect(isPrerelease(parse('2.0.0+build.1'))).toBe(false));
  it('direct object with non-empty prerelease → true', () =>
    expect(isPrerelease({ scheme: 'semver', major: 1, minor: 0, patch: 0, prerelease: ['alpha', '1'], build: [] })).toBe(true));
  it('direct object with empty prerelease → false', () =>
    expect(isPrerelease({ scheme: 'semver', major: 1, minor: 0, patch: 0, prerelease: [], build: [] })).toBe(false));
});

describe('isPrerelease — null / undefined passthrough', () => {
  it('undefined → undefined', () => expect(isPrerelease(undefined)).toBeUndefined());
  it('null → null', () => expect(isPrerelease(null)).toBeNull());
});

describe('isPrerelease — gentoo scheme', () => {
  it('alpha/beta/pre/rc suffixes → true', () => {
    expect(isPrerelease('1.2.3_alpha1', 'gentoo')).toBe(true);
    expect(isPrerelease('1.2.3_beta', 'gentoo')).toBe(true);
    expect(isPrerelease('1.2.3_pre2', 'gentoo')).toBe(true);
    expect(isPrerelease('1.2.3_rc1', 'gentoo')).toBe(true);
  });

  it('p suffix → false (sorts above release, not a prerelease)', () => {
    expect(isPrerelease('1.2.3_p1', 'gentoo')).toBe(false);
  });

  it('plain release → false', () => {
    expect(isPrerelease('1.2.3', 'gentoo')).toBe(false);
  });

  it('a -r revision is not a prerelease, unlike a semver "-" suffix', () => {
    expect(isPrerelease('1.2.3-r1', 'gentoo')).toBe(false);
    // Contrast: the same string under semver treats "-r1" as a prerelease.
    expect(isPrerelease('1.2.3-r1', 'semver')).toBe(true);
  });

  it('accepts a pre-parsed ParsedGentooVersion object, scheme read from it', () => {
    expect(isPrerelease(parse('1.2.3_rc1', 'gentoo'))).toBe(true);
    expect(isPrerelease(parse('1.2.3', 'gentoo'))).toBe(false);
  });

  it('throws for an unrecognized scheme, string input (bypassing the type system)', () => {
    expect(() => isPrerelease('1.2.3', 'bogus' as any)).toThrow(/Unhandled version scheme/);
  });

  it('throws for an unrecognized scheme, object input (bypassing the type system)', () => {
    expect(() => isPrerelease({ scheme: 'bogus' } as any)).toThrow(/Unhandled version scheme/);
  });
});
