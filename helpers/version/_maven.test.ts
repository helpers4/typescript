/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import {
  compareMaven,
  compareParsedMaven,
  incrementMaven,
  incrementPrereleaseMaven,
  isPrereleaseMaven,
  parseMaven,
  satisfiesRangeMaven,
  stringifyMaven,
} from './_maven';

// The cases of Maven's own ComparableVersionTest (maven-artifact 3.9).
const VERSIONS_QUALIFIER = [
  '1-alpha2snapshot', '1-alpha2', '1-alpha-123', '1-beta-2', '1-beta123', '1-m2', '1-m11', '1-rc', '1-cr2', '1-rc123', '1-SNAPSHOT', '1',
  '1-sp', '1-sp2', '1-sp123', '1-abc', '1-def', '1-pom-1', '1-1-snapshot', '1-1', '1-2', '1-123',
];
const VERSIONS_NUMBER = [
  '2.0', '2.0.a', '2-1', '2.0.2', '2.0.123', '2.1.0', '2.1-a', '2.1b', '2.1-c', '2.1-1', '2.1.0.1', '2.2', '2.123', '11.a2', '11.a11', '11.b2',
  '11.b11', '11.m2', '11.m11', '11', '11.a', '11b', '11c', '11m',
];

function expectOrdered(versions: string[]) {
  for (let i = 0; i < versions.length; i++) {
    for (let j = i + 1; j < versions.length; j++) {
      expect(compareMaven(versions[i]!, versions[j]!), `${versions[i]} < ${versions[j]}`).toBe(-1);
      expect(compareMaven(versions[j]!, versions[i]!), `${versions[j]} > ${versions[i]}`).toBe(1);
    }
  }
}

function expectEqual(a: string, b: string) {
  expect(compareMaven(a, b), `${a} == ${b}`).toBe(0);
  expect(compareMaven(b, a), `${b} == ${a}`).toBe(0);
}

describe('compareMaven', () => {
  it('orders qualifiers', () => expectOrdered(VERSIONS_QUALIFIER));
  it('orders numbers and mixed versions', () => expectOrdered(VERSIONS_NUMBER));

  it.each([
    ['1', '1'], ['1', '1.0'], ['1', '1.0.0'], ['1.0', '1.0.0'], ['1', '1-0'], ['1', '1.0-0'], ['1.0', '1.0-0'],
    ['1a', '1-a'], ['1a', '1.0-a'], ['1a', '1.0.0-a'], ['1.0a', '1-a'], ['1.0.0a', '1-a'],
    ['1x', '1-x'], ['1x', '1.0-x'], ['1x', '1.0.0-x'], ['1.0x', '1-x'], ['1.0.0x', '1-x'],
    ['1ga', '1'], ['1release', '1'], ['1final', '1'], ['1cr', '1rc'],
    ['1a1', '1-alpha-1'], ['1b2', '1-beta-2'], ['1m3', '1-milestone-3'],
    ['1X', '1x'], ['1A', '1a'], ['1B', '1b'], ['1M', '1m'], ['1Ga', '1'], ['1GA', '1'], ['1RELEASE', '1'], ['1RELeaSE', '1'], ['1Final', '1'],
    ['1FinaL', '1'], ['1FINAL', '1'], ['1Cr', '1Rc'], ['1cR', '1rC'], ['1m3', '1Milestone3'], ['1m3', '1MileStone3'], ['1m3', '1MILESTONE3'],
    ['1-abcdefghijklmnopqrstuvwxyz', '1-ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
  ])('%s == %s', (a, b) => expectEqual(a, b));

  it('compares versions', () => {
    for (const [low, high] of [
      ['1', '2'], ['1.5', '2'], ['1', '2.5'], ['1.0', '1.1'], ['1.1', '1.2'], ['1.0.0', '1.1'], ['1.0.1', '1.1'], ['1.1', '1.2.0'],
      ['1.0-alpha-1', '1.0'], ['1.0-alpha-1', '1.0-alpha-2'], ['1.0-alpha-1', '1.0-beta-1'], ['1.0-beta-1', '1.0-SNAPSHOT'],
      ['1.0-SNAPSHOT', '1.0'], ['1.0-alpha-1-SNAPSHOT', '1.0-alpha-1'], ['1.0', '1.0-1'], ['1.0-1', '1.0-2'], ['1.0.0', '1.0-1'],
      ['2.0-1', '2.0.1'], ['2.0.1-klm', '2.0.1-lmn'], ['2.0.1', '2.0.1-xyz'], ['2.0.1', '2.0.1-123'], ['2.0.1-xyz', '2.0.1-123'],
    ] as const) {
      expect(compareMaven(low, high), `${low} < ${high}`).toBe(-1);
      expect(compareMaven(high, low), `${high} > ${low}`).toBe(1);
    }
  });

  it('is transitive on the MNG-5568 edge case', () => {
    expectOrdered(['6.1.0rc3', '6.1.0']);
    expectOrdered(['6.1.0rc3', '6.1H.5-beta']);
    expectOrdered(['6.1.0', '6.1H.5-beta']);
  });

  it('handles numbers of any length (MNG-6572)', () => {
    expectOrdered(['20190126.230843', '1234567890.12345', '123456789012345.1H.5-beta', '12345678901234567890.1H.5-beta']);
  });

  it('ignores leading zeroes', () => {
    expectEqual('0000000000000000001', '1');
    expectEqual('01', '000000000001');
    expectEqual('0000000000000000000', '0');
    expectEqual('00', '0');
  });

  it('keeps 1-0.alpha below 1 (MNG-6964)', () => {
    expectOrdered(['1-0.alpha', '1-0.beta', '1']);
    expectOrdered(['1-0.alpha', '1']);
  });

  it.each(['abc', 'alpha', 'a', 'beta', 'b', 'def', 'milestone', 'm', 'RC'])('treats .%s as -%s (MNG-7644)', (x) => {
    expectOrdered([`1.0.0.${x}1`, `1.0.0-${x}2`]);
    expectEqual(`2-${x}`, `2.0.${x}`);
    expectEqual(`2-${x}`, `2.0.0.${x}`);
    expectEqual(`2.0.${x}`, `2.0.0.${x}`);
  });

  it('compares empty and degenerate versions', () => {
    expectEqual('', '0');
    expectEqual('.', '0');
    expectEqual('-', '0');
    expectOrdered(['0', '.1']);
    expectOrdered(['-1', '1']);
  });
});

describe('compareParsedMaven', () => {
  it('treats a list of null items like nothing, even when it was not normalized', () => {
    expect(compareParsedMaven({ scheme: 'maven', items: [1n, [0n, '']] }, { scheme: 'maven', items: [1n] })).toBe(0);
    expect(compareParsedMaven({ scheme: 'maven', items: [1n, [0n, 'sp']] }, { scheme: 'maven', items: [1n] })).toBe(1);
  });

  it('puts a nested list above a bare qualifier, and below a number', () => {
    expect(compareParsedMaven({ scheme: 'maven', items: [1n, [1n]] }, { scheme: 'maven', items: [1n, 'sp'] })).toBe(1);
    expect(compareParsedMaven({ scheme: 'maven', items: [1n, [1n]] }, { scheme: 'maven', items: [1n, 1n] })).toBe(-1);
  });
});

describe('parseMaven / stringifyMaven', () => {
  it('normalizes into items', () => {
    expect(parseMaven('1.0.0').items).toEqual([1n]);
    expect(parseMaven('1.0a1').items).toEqual([1n, ['alpha', [1n]]]);
    expect(parseMaven('1-1').items).toEqual([1n, [1n]]);
    expect(parseMaven('1cr2').items).toEqual([1n, ['rc', [2n]]]);
    expect(parseMaven('1.0-ga').items).toEqual([1n]);
    expect(parseMaven('12345678901234567890').items).toEqual([12345678901234567890n]);
  });

  it('writes Maven\'s canonical form', () => {
    expect(stringifyMaven(parseMaven('1.0.0'))).toBe('1');
    expect(stringifyMaven(parseMaven('1.0.0-RC1'))).toBe('1-rc-1');
    expect(stringifyMaven(parseMaven('1.2.3'))).toBe('1.2.3');
    expect(stringifyMaven(parseMaven('2.0.1-xyz'))).toBe('2.0.1-xyz');
    expect(stringifyMaven(parseMaven('1.0.0.X1'))).toBe('1-x-1');
    expect(stringifyMaven(parseMaven('1-1'))).toBe('1-1');
  });

  it('never throws, whatever the text', () => {
    expect(() => parseMaven('!?# é')).not.toThrow();
  });
});

describe('isPrereleaseMaven', () => {
  it.each([
    ['1.0-alpha-1', true], ['1.0-beta', true], ['1.0-m2', true], ['1.0-rc1', true], ['1.0-cr1', true], ['1.0-SNAPSHOT', true],
    ['1.0.0.RC1', true], ['1.0-alpha-1-SNAPSHOT', true],
    ['1.0', false], ['1.0-sp1', false], ['1.0-ga', false], ['1.0-final', false], ['1.0-1', false], ['1.0-abc', false],
  ])('%s: %s', (version, expected) => {
    expect(isPrereleaseMaven(parseMaven(version))).toBe(expected);
  });
});

describe('incrementMaven', () => {
  it('bumps the leading number and zeroes the ones after', () => {
    expect(incrementMaven('1.2.3', 'major')).toBe('2.0.0');
    expect(incrementMaven('1.2.3', 'minor')).toBe('1.3.0');
    expect(incrementMaven('1.2.3', 'patch')).toBe('1.2.4');
    expect(incrementMaven('1.2.3.4', 'minor')).toBe('1.3.0.0');
  });

  it('pads a short version and drops qualifiers', () => {
    expect(incrementMaven('1.2', 'patch')).toBe('1.2.1');
    expect(incrementMaven('1', 'major')).toBe('2.0.0');
    expect(incrementMaven('1.2.3-SNAPSHOT', 'patch')).toBe('1.2.4');
    expect(incrementMaven('1.2-rc1', 'minor')).toBe('1.3.0');
  });
});

describe('incrementPrereleaseMaven', () => {
  it('throws: Maven qualifiers are free-form', () => {
    expect(() => incrementPrereleaseMaven()).toThrow(/does not support incrementPrerelease/);
  });
});

describe('satisfiesRangeMaven', () => {
  it('checks closed and open bounds', () => {
    expect(satisfiesRangeMaven('1.5', '[1.0,2.0)')).toBe(true);
    expect(satisfiesRangeMaven('1.0', '[1.0,2.0)')).toBe(true);
    expect(satisfiesRangeMaven('2.0', '[1.0,2.0)')).toBe(false);
    expect(satisfiesRangeMaven('1.0', '(1.0,2.0]')).toBe(false);
    expect(satisfiesRangeMaven('2.0', '(1.0,2.0]')).toBe(true);
    expect(satisfiesRangeMaven('0.9', '[1.0,2.0]')).toBe(false);
    expect(satisfiesRangeMaven('2.1', '[1.0,2.0]')).toBe(false);
  });

  it('supports unbounded sides', () => {
    expect(satisfiesRangeMaven('0.1', '(,1.0]')).toBe(true);
    expect(satisfiesRangeMaven('1.1', '(,1.0]')).toBe(false);
    expect(satisfiesRangeMaven('9.9', '[1.2,)')).toBe(true);
    expect(satisfiesRangeMaven('1.1', '[1.2,)')).toBe(false);
  });

  it('supports an exact version and a union', () => {
    expect(satisfiesRangeMaven('1.5.0', '[1.5]')).toBe(true);
    expect(satisfiesRangeMaven('1.5.1', '[1.5]')).toBe(false);
    expect(satisfiesRangeMaven('1.1', '(,1.0],[1.2,)')).toBe(false);
    expect(satisfiesRangeMaven('1.2', '(,1.0],[1.2,)')).toBe(true);
    expect(satisfiesRangeMaven('0.5', '(,1.0],[1.2,)')).toBe(true);
    expect(satisfiesRangeMaven('1.2', '(,1.0], [1.2,)')).toBe(true);
  });

  it('reads a bare version as an exact match, a list of them as alternatives', () => {
    expect(satisfiesRangeMaven('1.0.0', '1.0')).toBe(true);
    expect(satisfiesRangeMaven('1.1', '1.0')).toBe(false);
    expect(satisfiesRangeMaven('2.0', '1.0,2.0')).toBe(true);
    expect(satisfiesRangeMaven('1.0', '1.0')).toBe(true);
    expect(satisfiesRangeMaven('2.0', '[1.0],2.0')).toBe(true);
  });

  it('rejects malformed ranges with a SyntaxError', () => {
    expect(() => satisfiesRangeMaven('1', '')).toThrow(/empty/);
    expect(() => satisfiesRangeMaven('1', '[1.0,2.0')).toThrow(/missing/);
    expect(() => satisfiesRangeMaven('1', '(1.0)')).toThrow(/single version/);
    expect(() => satisfiesRangeMaven('1', '[2.0,1.0]')).toThrow(/defies version ordering/);
  });
});
