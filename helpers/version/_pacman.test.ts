/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import {
  alpmvercmp,
  comparePacman,
  incrementPacman,
  incrementPrereleasePacman,
  isPrereleasePacman,
  parsePacman,
  satisfiesRangePacman,
  stringifyPacman,
} from './_pacman';

describe('parsePacman', () => {
  it('parses epoch, version and release', () => {
    expect(parsePacman('1:2.30rc1-3')).toEqual({ scheme: 'pacman', epoch: 1, version: '2.30rc1', release: '3' });
    expect(parsePacman('1.5.0')).toEqual({ scheme: 'pacman', epoch: 0, version: '1.5.0', release: '' });
  });

  it('accepts a release with a dot', () => {
    expect(parsePacman('1.0-1.1').release).toBe('1.1');
  });

  it.each([
    ['', /version is empty/],
    ['1.0 2', /whitespace/],
    ['x:1.0', /epoch/],
    ['1.0-', /release/],
    ['1.0/2', /character/],
  ])('throws a SyntaxError on %j', (input, message) => {
    expect(() => parsePacman(input)).toThrow(SyntaxError);
    expect(() => parsePacman(input)).toThrow(message);
  });
});

// The vectors of pacman's own vercmp test suite (test/util/vercmptest.sh).
describe('comparePacman', () => {
  it.each([
    // all similar length, no pkgrel
    ['1.5.0', '1.5.0', 0],
    ['1.5.1', '1.5.0', 1],
    // mixed length
    ['1.5.1', '1.5', 1],
    // with pkgrel, simple
    ['1.5.0-1', '1.5.0-1', 0],
    ['1.5.0-1', '1.5.0-2', -1],
    ['1.5.0-1', '1.5.1-1', -1],
    ['1.5.0-2', '1.5.1-1', -1],
    // with pkgrel, mixed lengths
    ['1.5-1', '1.5.1-1', -1],
    ['1.5-2', '1.5.1-1', -1],
    ['1.5-2', '1.5.1-2', -1],
    // mixed pkgrel inclusion
    ['1.5', '1.5-1', 0],
    ['1.5-1', '1.5', 0],
    ['1.1-1', '1.1', 0],
    ['1.0-1', '1.1', -1],
    ['1.1-1', '1.0', 1],
    // alphanumeric versions
    ['1.5b-1', '1.5-1', -1],
    ['1.5b', '1.5', -1],
    ['1.5b-1', '1.5', -1],
    ['1.5b', '1.5.1', -1],
    // from the manpage
    ['1.0a', '1.0alpha', -1],
    ['1.0alpha', '1.0b', -1],
    ['1.0b', '1.0beta', -1],
    ['1.0beta', '1.0rc', -1],
    ['1.0rc', '1.0', -1],
    // alpha-dotted versions
    ['1.5.a', '1.5', 1],
    ['1.5.b', '1.5.a', 1],
    ['1.5.1', '1.5.b', 1],
    // alpha dots and dashes
    ['1.5.b-1', '1.5.b', 0],
    ['1.5-1', '1.5.b', -1],
    // same or similar content, differing separators
    ['2.0', '2_0', 0],
    ['2.0_a', '2_0.a', 0],
    ['2.0a', '2.0.a', -1],
    ['2___a', '2_a', 1],
    // epoch included version comparisons
    ['0:1.0', '0:1.0', 0],
    ['0:1.0', '0:1.1', -1],
    ['1:1.0', '0:1.0', 1],
    ['1:1.0', '0:1.1', 1],
    ['1:1.0', '2:1.1', -1],
    // epoch plus a sometimes present pkgrel
    ['1:1.0', '0:1.0-1', 1],
    ['1:1.0-1', '0:1.1-1', 1],
    // epoch on one version only
    ['0:1.0', '1.0', 0],
    ['0:1.0', '1.1', -1],
    ['0:1.1', '1.0', 1],
    ['1:1.0', '1.0', 1],
    ['1:1.0', '1.1', 1],
    ['1:1.1', '1.1', 1],
  ])('comparePacman(%j, %j) = %i', (a, b, expected) => {
    expect(comparePacman(a, b)).toBe(expected);
    expect(comparePacman(b, a)).toBe(-expected || 0);
  });
});

describe('alpmvercmp', () => {
  it('compares numeric segments by value, ignoring leading zeros', () => {
    expect(alpmvercmp('1.002', '1.2')).toBe(0);
    expect(alpmvercmp('1.10', '1.9')).toBe(1);
  });

  it('puts a number above letters', () => {
    expect(alpmvercmp('1.1', '1.a')).toBe(1);
    expect(alpmvercmp('1.a', '1.1')).toBe(-1);
  });

  it('lets a trailing separator end the comparison', () => {
    expect(alpmvercmp('1.a', '1.')).toBe(-1);
    expect(alpmvercmp('1.1', '1.')).toBe(1);
  });

  it('compares letters by code point', () => {
    expect(alpmvercmp('1.ab', '1.ac')).toBe(-1);
  });
});

describe('stringifyPacman / isPrereleasePacman', () => {
  it('rebuilds the canonical string, dropping a 0 epoch', () => {
    expect(stringifyPacman(parsePacman('1:2.30rc1-3'))).toBe('1:2.30rc1-3');
    expect(stringifyPacman(parsePacman('0:1.0'))).toBe('1.0');
  });

  it('treats a letter segment after the first number as a prerelease', () => {
    expect(isPrereleasePacman(parsePacman('1.0rc1-1'))).toBe(true);
    expect(isPrereleasePacman(parsePacman('1.5.b'))).toBe(true);
    expect(isPrereleasePacman(parsePacman('1.0-1'))).toBe(false);
    expect(isPrereleasePacman(parsePacman('1.0.1'))).toBe(false);
  });
});

describe('incrementPacman / incrementPrereleasePacman', () => {
  it('throw: pacman versions are free-form', () => {
    expect(() => incrementPacman()).toThrow(/does not support increment/);
    expect(() => incrementPrereleasePacman()).toThrow(/does not support incrementPrerelease/);
  });
});

describe('satisfiesRangePacman', () => {
  it('checks dependency relations', () => {
    expect(satisfiesRangePacman('2.30-3', '>=2.0')).toBe(true);
    expect(satisfiesRangePacman('1.0rc1', '<1.0')).toBe(true);
    expect(satisfiesRangePacman('1.0', '=1.0-1')).toBe(true);
    expect(satisfiesRangePacman('1.0', '>1.0')).toBe(false);
    expect(satisfiesRangePacman('1.0', '<=1.0')).toBe(true);
    expect(satisfiesRangePacman('1.0', '1.0')).toBe(true);
  });

  it('throws a SyntaxError on an empty relation', () => {
    expect(() => satisfiesRangePacman('1.0', '  ')).toThrow(SyntaxError);
  });
});
