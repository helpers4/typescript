/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import {
  comparePep440,
  incrementPep440,
  incrementPrereleasePep440,
  isPrereleasePep440,
  parsePep440,
  satisfiesRangePep440,
  stringifyPep440,
} from './_pep440';
import { CANONICAL_VECTORS, COMPARE_VECTORS, RANGE_VECTORS } from './_pep440.model';

describe('parsePep440', () => {
  it('parses a plain release', () => {
    expect(parsePep440('1.2.3')).toEqual({ scheme: 'pep440', epoch: 0, release: [1, 2, 3], pre: null, post: null, dev: null, local: [] });
  });

  it('parses every part', () => {
    expect(parsePep440('1!2.0rc1.post2.dev3+Ubuntu.1')).toEqual({
      scheme: 'pep440',
      epoch: 1,
      release: [2, 0],
      pre: { type: 'rc', number: 1 },
      post: 2,
      dev: 3,
      local: ['ubuntu', 1],
    });
  });

  it('normalizes the spellings PEP 440 allows', () => {
    expect(parsePep440('v1.0-ALPHA.2').pre).toEqual({ type: 'a', number: 2 });
    expect(parsePep440('1.0_beta').pre).toEqual({ type: 'b', number: 0 });
    expect(parsePep440('1.0c3').pre).toEqual({ type: 'rc', number: 3 });
    expect(parsePep440('1.0.preview1').pre).toEqual({ type: 'rc', number: 1 });
    expect(parsePep440('1.0-1').post).toBe(1);
    expect(parsePep440('1.0.post').post).toBe(0);
    expect(parsePep440('1.0-rev2').post).toBe(2);
    expect(parsePep440('1.0r').post).toBe(0);
    expect(parsePep440('1.0.dev').dev).toBe(0);
    expect(parsePep440('  1.0+a-b_c.1  ').local).toEqual(['a', 'b', 'c', 1]);
  });

  it.each(['', 'abc', '1.', '1..0', '1.0+', '1.0.post1.post2', '1.0 1', '1.0a1b2', '!1.0'])('throws a SyntaxError on %j', (input) => {
    expect(() => parsePep440(input)).toThrow(SyntaxError);
  });
});

describe('stringifyPep440', () => {
  it('writes the canonical form', () => {
    expect(stringifyPep440(parsePep440('1!2.0-RC.1-post2_dev3+Ubuntu-1'))).toBe('1!2.0rc1.post2.dev3+ubuntu.1');
    expect(stringifyPep440(parsePep440('0!1.0'))).toBe('1.0');
  });

  it.each(CANONICAL_VECTORS)('canonical form of %j is %j', (input, expected) => {
    expect(stringifyPep440(parsePep440(input))).toBe(expected);
  });
});

describe('comparePep440', () => {
  it.each(COMPARE_VECTORS)('comparePep440(%j, %j) = %i', (a, b, expected) => {
    expect(comparePep440(a, b)).toBe(expected);
    expect(comparePep440(b, a)).toBe(-expected || 0);
  });

  it('orders the whole life cycle of a release', () => {
    const order = ['1.0.dev1', '1.0a1.dev1', '1.0a1', '1.0a2', '1.0b1', '1.0rc1', '1.0', '1.0+local', '1.0+local.1', '1.0.post1.dev1', '1.0.post1', '1.1.dev1'];
    for (let i = 0; i < order.length - 1; i++) expect(comparePep440(order[i]!, order[i + 1]!)).toBe(-1);
  });

  it('ignores trailing zeros of the release', () => {
    expect(comparePep440('1.0.0', '1')).toBe(0);
    expect(comparePep440('0', '0.0')).toBe(0);
  });

  it('puts a number above a string in a local label', () => {
    expect(comparePep440('1.0+1', '1.0+a')).toBe(1);
    expect(comparePep440('1.0+a', '1.0+1')).toBe(-1);
    expect(comparePep440('1.0+a', '1.0+b')).toBe(-1);
    expect(comparePep440('1.0+b', '1.0+a')).toBe(1);
    expect(comparePep440('1.0+a.1', '1.0+a.2')).toBe(-1);
    expect(comparePep440('1.0+a', '1.0+a')).toBe(0);
  });
});

describe('isPrereleasePep440', () => {
  it('is true for pre-releases and dev releases only', () => {
    expect(isPrereleasePep440(parsePep440('1.0a1'))).toBe(true);
    expect(isPrereleasePep440(parsePep440('1.0.dev1'))).toBe(true);
    expect(isPrereleasePep440(parsePep440('1.0'))).toBe(false);
    expect(isPrereleasePep440(parsePep440('1.0.post1'))).toBe(false);
  });
});

describe('incrementPep440', () => {
  it('bumps the component at the position and zeroes the rest', () => {
    expect(incrementPep440('1.2.3', 'major')).toBe('2.0.0');
    expect(incrementPep440('1.2.3', 'minor')).toBe('1.3.0');
    expect(incrementPep440('1.2.3', 'patch')).toBe('1.2.4');
    expect(incrementPep440('1.2.3.4', 'minor')).toBe('1.3.0.0');
  });

  it('pads a short release and drops pre, post, dev and local', () => {
    expect(incrementPep440('1.2', 'patch')).toBe('1.2.1');
    expect(incrementPep440('1', 'major')).toBe('2.0.0');
    expect(incrementPep440('1!1.2.3rc1.post2.dev3+x', 'patch')).toBe('1!1.2.4');
  });
});

describe('incrementPrereleasePep440', () => {
  it('starts a pre-release on the next patch', () => {
    expect(incrementPrereleasePep440('1.2.3', 'a')).toBe('1.2.4a0');
    expect(incrementPrereleasePep440('1.2', 'rc')).toBe('1.2.1rc0');
  });

  it('increments the same marker and restarts another one', () => {
    expect(incrementPrereleasePep440('1.2.4a0', 'a')).toBe('1.2.4a1');
    expect(incrementPrereleasePep440('1.2.4a3', 'b')).toBe('1.2.4b0');
    expect(incrementPrereleasePep440('1.2.4rc1.post1.dev2+x', 'rc')).toBe('1.2.4rc2');
  });

  it('accepts the spellings of the markers', () => {
    expect(incrementPrereleasePep440('1.0.0', 'ALPHA')).toBe('1.0.1a0');
    expect(incrementPrereleasePep440('1.0.1a0', 'beta')).toBe('1.0.1b0');
    expect(incrementPrereleasePep440('1.0.1b0', 'c')).toBe('1.0.1rc0');
  });

  it('throws on an unknown marker', () => {
    expect(() => incrementPrereleasePep440('1.0.0', 'gamma')).toThrow(/not a valid PEP 440 pre-release marker/);
  });
});

describe('satisfiesRangePep440', () => {
  it.each(RANGE_VECTORS)('%j satisfies %j: %s', (version, range, expected) => {
    expect(satisfiesRangePep440(version, range)).toBe(expected);
  });

  it('requires every clause of a set', () => {
    expect(satisfiesRangePep440('1.5', '>=1.0,<2.0')).toBe(true);
    expect(satisfiesRangePep440('2.0', '>=1.0, <2.0')).toBe(false);
    expect(satisfiesRangePep440('1.5', '>=1.0,!=1.5')).toBe(false);
  });

  it('matches everything with an empty set', () => {
    expect(satisfiesRangePep440('1.5', '')).toBe(true);
    expect(satisfiesRangePep440('1.5', ' , ')).toBe(true);
  });

  it('keeps pre-releases of an excluded bound out', () => {
    expect(satisfiesRangePep440('2.0rc1', '<2.0')).toBe(false);
    expect(satisfiesRangePep440('2.0rc1', '<2.0rc2')).toBe(true);
    expect(satisfiesRangePep440('1.9', '<2.0')).toBe(true);
    expect(satisfiesRangePep440('2.0.post1', '>2.0')).toBe(false);
    expect(satisfiesRangePep440('2.0+local', '>2.0')).toBe(false);
    expect(satisfiesRangePep440('2.0.post2', '>2.0.post1')).toBe(true);
    expect(satisfiesRangePep440('2.1', '>2.0')).toBe(true);
  });

  it('compares local labels only when the specifier has one', () => {
    expect(satisfiesRangePep440('1.0+abc', '==1.0')).toBe(true);
    expect(satisfiesRangePep440('1.0+abc', '==1.0+abc')).toBe(true);
    expect(satisfiesRangePep440('1.0+abc', '==1.0+xyz')).toBe(false);
  });

  it('supports prefix matching and the compatible release', () => {
    expect(satisfiesRangePep440('1.4.9', '==1.4.*')).toBe(true);
    expect(satisfiesRangePep440('1.5.0', '==1.4.*')).toBe(false);
    expect(satisfiesRangePep440('1.4', '==1.4.0.*')).toBe(true);
    expect(satisfiesRangePep440('1.5', '!=1.4.*')).toBe(true);
    expect(satisfiesRangePep440('1!1.4', '==1.4.*')).toBe(false);
    expect(satisfiesRangePep440('1.4.9', '~=1.4.5')).toBe(true);
    expect(satisfiesRangePep440('1.5.0', '~=1.4.5')).toBe(false);
    expect(satisfiesRangePep440('2.5', '~=2.2')).toBe(true);
  });

  it('matches === on the exact string, case-insensitively', () => {
    expect(satisfiesRangePep440('1.0', '===1.0')).toBe(true);
    expect(satisfiesRangePep440('1.0.0', '===1.0')).toBe(false);
    expect(satisfiesRangePep440(' 1.0RC1 ', '===1.0rc1')).toBe(true);
  });

  it('throws a SyntaxError on a malformed specifier', () => {
    expect(() => satisfiesRangePep440('1.0', '1.0')).toThrow(/expected an operator/);
    expect(() => satisfiesRangePep440('1.0', '>=1.*')).toThrow(/only allowed with == and !=/);
    expect(() => satisfiesRangePep440('1.0', '==1.0a1.*')).toThrow(/only follows a release segment/);
    expect(() => satisfiesRangePep440('1.0', '==1.0+x.*')).toThrow(/only follows a release segment/);
    expect(() => satisfiesRangePep440('1.0', '~=1')).toThrow(/at least two release components/);
    expect(() => satisfiesRangePep440('1.0', '>=abc')).toThrow(SyntaxError);
    expect(() => satisfiesRangePep440('abc', '>=1.0')).toThrow(SyntaxError);
  });
});
