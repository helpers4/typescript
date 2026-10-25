/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isValid } from './isValid';
import type { VersionScheme } from './types';

describe('isValid — semver', () => {
  it.each(['0.0.0', '1.2.3', '10.20.30', '1.0.0-alpha', '1.0.0-alpha.1', '1.0.0-0.3.7', '1.0.0-x.7.z.92', '1.0.0-x-y-z.--', '1.0.0+20130313144700',
    '1.0.0-beta+exp.sha.5114f85', '1.0.0+21AF26D3----117B344092BD', '1.0.0-0', '1.0.0-a0', '1.0.0-0a', '1.0.0-1.0a', '1.0.0+001', '1.0.0-rc.1+b5',
  ])('accepts %j', (version) => {
    expect(isValid(version)).toBe(true);
  });

  it.each([
    ['empty', ''],
    ['garbage', 'garbage'],
    ['v prefix', 'v1.2.3'],
    ['capital V prefix', 'V1.2.3'],
    ['two parts', '1.2'],
    ['one part', '1'],
    ['four parts', '1.2.3.4'],
    ['leading zero in major', '01.2.3'],
    ['leading zero in minor', '1.02.3'],
    ['leading zero in patch', '1.2.03'],
    ['numeric prerelease with leading zero', '1.2.3-01'],
    ['numeric prerelease with leading zero after a dot', '1.2.3-alpha.01'],
    ['empty prerelease', '1.2.3-'],
    ['empty prerelease identifier', '1.2.3-alpha..1'],
    ['empty build', '1.2.3+'],
    ['empty build identifier', '1.2.3+a..b'],
    ['bad character in prerelease', '1.2.3-al_pha'],
    ['bad character in build', '1.2.3+b!'],
    ['leading space', ' 1.2.3'],
    ['trailing space', '1.2.3 '],
    ['trailing newline', '1.2.3\n'],
    ['negative number', '-1.2.3'],
    ['letters in the core', '1.x.3'],
  ])('rejects %s', (_label, version) => {
    expect(isValid(version)).toBe(false);
  });

  it.each([null, undefined, 123, 1.2, true, {}, [], ['1.2.3'], Symbol('1.2.3'), 10n])('rejects the non-string %s without throwing', (value) => {
    expect(isValid(value)).toBe(false);
  });
});

describe('isValid — other schemes', () => {
  const cases: [VersionScheme, string[], string[]][] = [
    ['gentoo', ['1.2.3', '1.2.3b_rc1-r2', '2.0_p1'], ['', '1.2.3-beta', 'abc', '1..2']],
    ['debian', ['1.2.3', '1:2.30~rc1-3ubuntu2', '1.0-beta-1'], ['', '1.0_1', '1.0 2', 'x:1.0']],
    ['rpm', ['1.2.3', '1:2.30~rc1-3.fc40', '1.0^git1'], ['', '1.0 2', 'a:1.0', '1.0!']],
    ['pacman', ['1.5.0-1', '1:2.30rc1-3', '1.0a'], ['', '1.0 2', 'x:1.0', '1.0/2']],
    ['pep440', ['1.0', '1!2.0rc1.post2.dev3+ubuntu.1', 'v1.0-ALPHA.2'], ['', 'abc', '1.', '1.0.post1.post2']],
    ['maven', ['1', '1.0-SNAPSHOT', 'anything at all'], ['']],
  ];

  it.each(cases)('%s accepts what parse accepts and rejects what it rejects', (scheme, valid, invalid) => {
    for (const version of valid) expect(isValid(version, scheme), `${scheme} ${version}`).toBe(true);
    for (const version of invalid) expect(isValid(version, scheme), `${scheme} ${version}`).toBe(false);
  });

  it('rejects non-strings in every scheme', () => {
    for (const [scheme] of cases) expect(isValid(undefined, scheme)).toBe(false);
  });

  it('returns false for an unknown scheme instead of throwing', () => {
    expect(isValid('1.2.3', 'bogus' as VersionScheme)).toBe(false);
  });
});
