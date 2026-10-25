/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { compareRpm, incrementPrereleaseRpm, incrementRpm, isPrereleaseRpm, parseRpm, rpmvercmp, satisfiesRangeRpm, stringifyRpm } from './_rpm';

describe('parseRpm', () => {
  it('parses a bare version', () => {
    expect(parseRpm('1.2.3')).toEqual({ scheme: 'rpm', epoch: 0, version: '1.2.3', release: '' });
  });

  it('parses epoch, version and release', () => {
    expect(parseRpm('1:2.30~rc1-3.fc40')).toEqual({ scheme: 'rpm', epoch: 1, version: '2.30~rc1', release: '3.fc40' });
  });

  it.each([
    ['', /version is empty/],
    ['1.0 2', /whitespace/],
    ['a:1.0', /epoch/],
    ['1.0-', /release/],
    ['1.0-a b', /whitespace/],
    ['1.0!', /character/],
  ])('throws a SyntaxError on %j', (input, message) => {
    expect(() => parseRpm(input)).toThrow(SyntaxError);
    expect(() => parseRpm(input)).toThrow(message);
  });
});

describe('rpmvercmp', () => {
  // The vectors of rpm's own rpmvercmp test suite.
  it.each([
    ['1.0', '1.0', 0],
    ['1.0', '2.0', -1],
    ['2.0', '1.0', 1],
    ['2.0.1', '2.0.1', 0],
    ['2.0', '2.0.1', -1],
    ['2.0.1', '2.0', 1],
    ['2.0.1a', '2.0.1a', 0],
    ['2.0.1a', '2.0.1', 1],
    ['2.0.1', '2.0.1a', -1],
    ['5.5p1', '5.5p1', 0],
    ['5.5p1', '5.5p2', -1],
    ['5.5p2', '5.5p1', 1],
    ['5.5p10', '5.5p10', 0],
    ['5.5p1', '5.5p10', -1],
    ['5.5p10', '5.5p1', 1],
    ['10xyz', '10.1xyz', -1],
    ['10.1xyz', '10xyz', 1],
    ['xyz10', 'xyz10', 0],
    ['xyz10', 'xyz10.1', -1],
    ['xyz10.1', 'xyz10', 1],
    ['xyz.4', 'xyz.4', 0],
    ['xyz.4', '8', -1],
    ['8', 'xyz.4', 1],
    ['xyz.4', '2', -1],
    ['2', 'xyz.4', 1],
    ['5.5p2', '5.6p1', -1],
    ['5.6p1', '5.5p2', 1],
    ['5.6p1', '6.5p1', -1],
    ['6.5p1', '5.6p1', 1],
    ['6.0.rc1', '6.0', 1],
    ['6.0', '6.0.rc1', -1],
    ['10b2', '10a1', 1],
    ['10a2', '10b2', -1],
    ['1.0aa', '1.0aa', 0],
    ['1.0a', '1.0aa', -1],
    ['1.0aa', '1.0a', 1],
    ['10.0001', '10.0001', 0],
    ['10.0001', '10.1', 0],
    ['10.1', '10.0001', 0],
    ['10.0001', '10.0039', -1],
    ['10.0039', '10.0001', 1],
    ['4.999.9', '5.0', -1],
    ['5.0', '4.999.9', 1],
    ['20101121', '20101121', 0],
    ['20101121', '20101122', -1],
    ['20101122', '20101121', 1],
    ['2_0', '2_0', 0],
    ['2.0', '2_0', 0],
    ['2_0', '2.0', 0],
    ['a', 'a', 0],
    ['a+', 'a+', 0],
    ['a+', 'a_', 0],
    ['a_', 'a+', 0],
    ['+a', '+a', 0],
    ['+a', '_a', 0],
    ['_a', '+a', 0],
    ['+_', '+_', 0],
    ['_+', '+_', 0],
    ['_+', '_+', 0],
    ['+', '_', 0],
    ['_', '+', 0],
    // tilde
    ['1.0~rc1', '1.0~rc1', 0],
    ['1.0~rc1', '1.0', -1],
    ['1.0', '1.0~rc1', 1],
    ['1.0~rc1', '1.0~rc2', -1],
    ['1.0~rc2', '1.0~rc1', 1],
    ['1.0~rc1~git123', '1.0~rc1~git123', 0],
    ['1.0~rc1~git123', '1.0~rc1', -1],
    ['1.0~rc1', '1.0~rc1~git123', 1],
    // caret
    ['1.0^', '1.0^', 0],
    ['1.0^', '1.0', 1],
    ['1.0', '1.0^', -1],
    ['1.0^git1', '1.0^git1', 0],
    ['1.0^git1', '1.0', 1],
    ['1.0', '1.0^git1', -1],
    ['1.0^git1', '1.0^git2', -1],
    ['1.0^git2', '1.0^git1', 1],
    ['1.0^git1', '1.01', -1],
    ['1.01', '1.0^git1', 1],
    ['1.0^20160101', '1.0^20160101', 0],
    ['1.0^20160101', '1.0.1', -1],
    ['1.0.1', '1.0^20160101', 1],
    ['1.0^20160101^git1', '1.0^20160101^git1', 0],
    ['1.0^20160102', '1.0^20160101^git1', 1],
    ['1.0^20160101^git1', '1.0^20160102', -1],
    // tilde and caret together
    ['1.0~rc1^git1', '1.0~rc1^git1', 0],
    ['1.0~rc1^git1', '1.0~rc1', 1],
    ['1.0~rc1', '1.0~rc1^git1', -1],
    ['1.0^git1~pre', '1.0^git1~pre', 0],
    ['1.0^git1', '1.0^git1~pre', 1],
    ['1.0^git1~pre', '1.0^git1', -1],
  ])('rpmvercmp(%j, %j) = %i', (a, b, expected) => {
    expect(rpmvercmp(a, b)).toBe(expected);
  });
});

describe('compareRpm', () => {
  it('compares the epoch first, then the version, then the release', () => {
    expect(compareRpm('1:1.0', '2.0')).toBe(1);
    expect(compareRpm('0:1.0', '1.0')).toBe(0);
    expect(compareRpm('1.0-2', '1.0-10')).toBe(-1);
    expect(compareRpm('1.0-2', '1.1-1')).toBe(-1);
  });

  it('ignores the release when one side has none', () => {
    expect(compareRpm('1.0', '1.0-5')).toBe(0);
    expect(compareRpm('1.0-5', '1.0')).toBe(0);
  });
});

describe('stringifyRpm / isPrereleaseRpm', () => {
  it('rebuilds the canonical string, dropping a 0 epoch', () => {
    expect(stringifyRpm(parseRpm('1:2.30~rc1-3.fc40'))).toBe('1:2.30~rc1-3.fc40');
    expect(stringifyRpm(parseRpm('0:1.0'))).toBe('1.0');
    expect(stringifyRpm(parseRpm('1.0-1'))).toBe('1.0-1');
  });

  it('treats a tilde in the version as a prerelease', () => {
    expect(isPrereleaseRpm(parseRpm('1.0~rc1-1'))).toBe(true);
    expect(isPrereleaseRpm(parseRpm('1.0-1~bpo'))).toBe(false);
    expect(isPrereleaseRpm(parseRpm('1.0^git1'))).toBe(false);
  });
});

describe('incrementRpm / incrementPrereleaseRpm', () => {
  it('throw: RPM versions are free-form', () => {
    expect(() => incrementRpm()).toThrow(/does not support increment/);
    expect(() => incrementPrereleaseRpm()).toThrow(/does not support incrementPrerelease/);
  });
});

describe('satisfiesRangeRpm', () => {
  it('checks dependency relations', () => {
    expect(satisfiesRangeRpm('2.30-3', '>= 2.0')).toBe(true);
    expect(satisfiesRangeRpm('2.30-3', '>=2.30')).toBe(true);
    expect(satisfiesRangeRpm('2.30', '> 2.30')).toBe(false);
    expect(satisfiesRangeRpm('1.0~rc1', '< 1.0')).toBe(true);
    expect(satisfiesRangeRpm('1.0', '<= 1.0')).toBe(true);
    expect(satisfiesRangeRpm('1.0', '= 1.0')).toBe(true);
    expect(satisfiesRangeRpm('1.0', '== 1.0')).toBe(true);
    expect(satisfiesRangeRpm('1.0', '1.0')).toBe(true);
    expect(satisfiesRangeRpm('1.1', '1.0')).toBe(false);
  });

  it('throws a SyntaxError on an empty relation', () => {
    expect(() => satisfiesRangeRpm('1.0', '')).toThrow(SyntaxError);
  });
});
