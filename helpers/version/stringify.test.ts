/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { parse } from './parse';
import { stringify } from './stringify';

describe('stringify — stable versions', () => {
  it('1.2.3', () => expect(stringify({ scheme: 'semver', major: 1, minor: 2, patch: 3, prerelease: [], build: [] })).toBe('1.2.3'));
  it('0.0.0', () => expect(stringify({ scheme: 'semver', major: 0, minor: 0, patch: 0, prerelease: [], build: [] })).toBe('0.0.0'));
  it('10.20.30', () => expect(stringify({ scheme: 'semver', major: 10, minor: 20, patch: 30, prerelease: [], build: [] })).toBe('10.20.30'));
});

describe('stringify — prerelease versions', () => {
  it('2.0.0-alpha.1', () =>
    expect(stringify({ scheme: 'semver', major: 2, minor: 0, patch: 0, prerelease: ['alpha', '1'], build: [] })).toBe('2.0.0-alpha.1'));
  it('1.0.0-beta', () =>
    expect(stringify({ scheme: 'semver', major: 1, minor: 0, patch: 0, prerelease: ['beta'], build: [] })).toBe('1.0.0-beta'));
  it('3.0.0-rc.0', () =>
    expect(stringify({ scheme: 'semver', major: 3, minor: 0, patch: 0, prerelease: ['rc', '0'], build: [] })).toBe('3.0.0-rc.0'));
  it('1.0.0-0.3.7', () =>
    expect(stringify({ scheme: 'semver', major: 1, minor: 0, patch: 0, prerelease: ['0', '3', '7'], build: [] })).toBe('1.0.0-0.3.7'));
});

describe('stringify — build metadata', () => {
  it('2.0.0+build.123', () =>
    expect(stringify({ scheme: 'semver', major: 2, minor: 0, patch: 0, prerelease: [], build: ['build', '123'] })).toBe('2.0.0+build.123'));
  it('1.0.0-beta+exp.sha.5114f85', () =>
    expect(stringify({ scheme: 'semver', major: 1, minor: 0, patch: 0, prerelease: ['beta'], build: ['exp', 'sha', '5114f85'] })).toBe('1.0.0-beta+exp.sha.5114f85'));
});

describe('stringify — null / undefined passthrough', () => {
  it('undefined → undefined', () => expect(stringify(undefined)).toBeUndefined());
  it('null → null', () => expect(stringify(null)).toBeNull());
});

describe('stringify — round-trips with parse', () => {
  const versions = ['1.2.3', '2.0.0-alpha.1', '1.0.0-rc.0', '2.0.0+build.123', '1.0.0-beta+exp.sha.5114f85'];
  for (const v of versions) {
    it(`round-trips ${v}`, () => expect(stringify(parse(v))).toBe(v));
  }
});

describe('stringify — gentoo scheme', () => {
  it('stringifies a ParsedGentooVersion (scheme read from the object, no separate option)', () => {
    expect(stringify({ scheme: 'gentoo', components: [1, 2, 3], letter: 'b', suffixes: [{ type: 'rc', number: 1 }], revision: 2 })).toBe(
      '1.2.3b_rc1-r2',
    );
  });

  it('round-trips gentoo versions with parse', () => {
    const versions = ['1.2.3', '1.2.3b_rc1-r2'];
    for (const v of versions) {
      expect(stringify(parse(v, 'gentoo'))).toBe(v);
    }
  });

  it('throws for an unrecognized scheme (bypassing the type system, as a plain-JS caller would)', () => {
    // Asserts the actual bad object is rendered as JSON, not the useless "[object Object]" a
    // bare String(parsed) would produce — regression test for assertNeverScheme's object case.
    expect(() => stringify({ scheme: 'bogus' } as any)).toThrow('Unhandled version scheme: {"scheme":"bogus"}');
  });
});
