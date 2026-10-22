/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import {
  compareDebian,
  incrementDebian,
  incrementPrereleaseDebian,
  isPrereleaseDebian,
  parseDebian,
  satisfiesRangeDebian,
  stringifyDebian,
} from './_debian';

describe('parseDebian', () => {
  it('parses a bare upstream version', () => {
    expect(parseDebian('1.2.3')).toEqual({ scheme: 'debian', epoch: 0, upstream: '1.2.3', revision: '' });
  });

  it('parses epoch, upstream and revision', () => {
    expect(parseDebian('1:2.30~rc1-3ubuntu2')).toEqual({ scheme: 'debian', epoch: 1, upstream: '2.30~rc1', revision: '3ubuntu2' });
  });

  it('splits the revision at the last hyphen, so the upstream part may contain hyphens', () => {
    expect(parseDebian('1.0-beta-1')).toEqual({ scheme: 'debian', epoch: 0, upstream: '1.0-beta', revision: '1' });
  });

  it('parses an explicit 0 epoch', () => {
    expect(parseDebian('0:1.0').epoch).toBe(0);
  });

  it('accepts an upstream version that does not start with a digit (dpkg only warns)', () => {
    expect(parseDebian('a1.0').upstream).toBe('a1.0');
  });

  it.each([
    ['', /upstream version is empty/],
    ['1.0 -1', /whitespace/],
    [' 1.0', /whitespace/],
    ['a:1.0', /epoch/],
    ['-1:1.0', /epoch/],
    ['1:', /upstream version is empty/],
    ['-1', /upstream version is empty/],
    ['1.0-', /revision/],
    ['1.0-a_b', /revision/],
    ['1.0_1', /upstream version may only contain/],
    ['1:2:3', /upstream version may only contain/],
  ])('throws a SyntaxError on %j', (version, reason) => {
    expect(() => parseDebian(version)).toThrow(SyntaxError);
    expect(() => parseDebian(version)).toThrow(reason);
  });
});

describe('compareDebian', () => {
  it.each([
    ['1.0', '1.0', 0],
    ['1.0', '1.1', -1],
    ['1.10', '1.9', 1],
    ['001', '1', 0],
    ['1.0', '1.0-0', 0],
    ['0:1.0', '1.0', 0],
    ['1:1.0', '2.0', 1],
    ['2:0.1', '10:0.1', -1],
    ['1.0~rc1', '1.0', -1],
    ['1.0~rc1', '1.0~rc2', -1],
    ['1.0~beta', '1.0~rc', -1],
    ['1.0-1', '1.0-2', -1],
    ['1.0-10', '1.0-9', 1],
    ['2.30-3ubuntu2', '2.30-3', 1],
    ['1.0-1~bpo12+1', '1.0-1', -1],
    ['1.0', '1.0.1', -1],
    ['1.0', '1.0.', -1],
    ['1.0a', '1.0+', -1],
    ['1.0a', '1.0b', -1],
    ['1.1', '1.a', -1],
    ['1.0Z', '1.0a', -1],
    ['1.0-beta-1', '1.0-beta-2', -1],
    ['1.20260101000000000001', '1.20260101000000000002', -1],
    ['1.900719925474099100', '1.900719925474099099', 1],
  ] as const)('compareDebian(%j, %j) === %d', (a, b, expected) => {
    expect(compareDebian(a, b)).toBe(expected);
    expect(compareDebian(b, a)).toBe(-expected || 0);
  });

  it('orders tildes before everything, even the end of the string (Debian Policy example)', () => {
    const sorted = ['1.0~~', '1.0~~a', '1.0~', '1.0', '1.0a'];
    expect(sorted.toReversed().sort(compareDebian)).toEqual(sorted);
  });

  it('only ever returns -1, 0 or 1', () => {
    expect(compareDebian('9:1.0', '1.0')).toBe(1);
    expect(compareDebian('1.0z', '1.0~')).toBe(1);
  });

  it('throws on an invalid version', () => {
    expect(() => compareDebian('1.0', '1.0_1')).toThrow(SyntaxError);
  });
});

describe('isPrereleaseDebian', () => {
  it('is true when the upstream part contains ~', () => {
    expect(isPrereleaseDebian(parseDebian('1.0~rc1-1'))).toBe(true);
  });

  it('is false for a release', () => {
    expect(isPrereleaseDebian(parseDebian('1.0-1'))).toBe(false);
  });

  it('ignores a ~ in the revision (a backport, not a prerelease)', () => {
    expect(isPrereleaseDebian(parseDebian('1.0-1~bpo12+1'))).toBe(false);
  });
});

describe('stringifyDebian', () => {
  it('round-trips every part', () => {
    expect(stringifyDebian(parseDebian('1:2.30~rc1-3ubuntu2'))).toBe('1:2.30~rc1-3ubuntu2');
  });

  it('omits an empty revision', () => {
    expect(stringifyDebian({ scheme: 'debian', epoch: 0, upstream: '1.0', revision: '' })).toBe('1.0');
  });

  it('drops a 0 epoch', () => {
    expect(stringifyDebian(parseDebian('0:1.0-1'))).toBe('1.0-1');
  });
});

describe('incrementDebian / incrementPrereleaseDebian', () => {
  it('both throw, Debian versions have no structure to bump', () => {
    expect(() => incrementDebian()).toThrow(/does not support increment/);
    expect(() => incrementPrereleaseDebian()).toThrow(/does not support incrementPrerelease/);
  });
});

describe('satisfiesRangeDebian', () => {
  it.each([
    ['1.0-1', '<< 1.1', true],
    ['1.1', '<< 1.1', false],
    ['1.1', '<= 1.1', true],
    ['1.2', '<= 1.1', false],
    ['1.1', '= 1.1', true],
    ['1.1-1', '= 1.1', false],
    ['1.1', '>= 1.1', true],
    ['1.0', '>= 1.1', false],
    ['1.2', '>> 1.1', true],
    ['1.1', '>> 1.1', false],
    ['1.1', '1.1', true],
    ['1.1', '1.2', false],
    ['1.0~rc1-1', '<<1.0', true],
    ['1:0.9-1', '>=2.0', true],
    ['1.1', '  >=   1.0  ', true],
  ] as const)('satisfiesRangeDebian(%j, %j) === %s', (version, range, expected) => {
    expect(satisfiesRangeDebian(version, range)).toBe(expected);
  });

  it.each(['<', '>'])('throws on the obsolete %s operator', (operator) => {
    expect(() => satisfiesRangeDebian('1.0', `${operator} 1.0`)).toThrow(/obsolete/);
  });

  it.each(['^1.0', '~1.0'])('throws on the SemVer-only range %j', (range) => {
    expect(() => satisfiesRangeDebian('1.0', range)).toThrow(/no Debian equivalent/);
  });

  it('throws on an empty range', () => {
    expect(() => satisfiesRangeDebian('1.0', '   ')).toThrow(/not a valid Debian relation/);
  });

  it('throws on an invalid target version', () => {
    expect(() => satisfiesRangeDebian('1.0', '>= 1_0')).toThrow(SyntaxError);
  });
});
