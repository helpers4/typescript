/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { parseDependencies } from './parseDependencies';

describe('parseDependencies', () => {
  it('parses the full syntax: versions, alternatives, architecture qualifier, restrictions, profiles', () => {
    expect(parseDependencies('libc6 (>= 2.34), python3:any | python3 (>= 3.8) [amd64], foo <!nocheck>')).toEqual([
      [{ name: 'libc6', version: { operator: '>=', version: '2.34' } }],
      [
        { name: 'python3', arch: 'any' },
        { name: 'python3', version: { operator: '>=', version: '3.8' }, architectures: ['amd64'] },
      ],
      [{ name: 'foo', profiles: [['!nocheck']] }],
    ]);
  });

  it('parses a bare name and the five Policy operators', () => {
    expect(parseDependencies('a')).toEqual([[{ name: 'a' }]]);
    for (const operator of ['<<', '<=', '=', '>=', '>>']) {
      expect(parseDependencies(`pkg (${operator} 1:2.0-1~rc1)`)).toEqual([
        [{ name: 'pkg', version: { operator, version: '1:2.0-1~rc1' } }],
      ]);
    }
  });

  it('reads the obsolete < and > as dpkg does, <= and >=, in compat mode', () => {
    expect(parseDependencies('a (< 2), b (> 1)', 'debian', { compat: true })).toEqual([
      [{ name: 'a', version: { operator: '<=', version: '2' } }],
      [{ name: 'b', version: { operator: '>=', version: '1' } }],
    ]);
  });

  it('refuses the obsolete < and > by default, with a hint', () => {
    expect(() => parseDependencies('a (< 2)')).toThrow(SyntaxError);
    expect(() => parseDependencies('a (< 2)')).toThrow(/obsolete operator "<" is not allowed/);
    expect(() => parseDependencies('b (> 1)', 'debian', { compat: false })).toThrow(/obsolete operator ">"/);
  });

  it('still reads the five Policy operators as written in compat mode', () => {
    expect(parseDependencies('a (<< 2), b (>> 1)', 'debian', { compat: true })).toEqual([
      [{ name: 'a', version: { operator: '<<', version: '2' } }],
      [{ name: 'b', version: { operator: '>>', version: '1' } }],
    ]);
  });

  it('parses architecture restrictions with negations', () => {
    expect(parseDependencies('libfoo [!i386 !armel], bar [linux-any]')).toEqual([
      [{ name: 'libfoo', architectures: ['!i386', '!armel'] }],
      [{ name: 'bar', architectures: ['linux-any'] }],
    ]);
  });

  it('parses several build profile groups, each with AND-ed terms', () => {
    expect(parseDependencies('dh-python <!nocheck cross> <stage1>')).toEqual([
      [{ name: 'dh-python', profiles: [['!nocheck', 'cross'], ['stage1']] }],
    ]);
  });

  it('parses every part together, in order', () => {
    expect(parseDependencies('gcc:native (>> 4:12) [amd64 arm64] <!cross> <pkg.x>')).toEqual([
      [{
        name: 'gcc',
        arch: 'native',
        version: { operator: '>>', version: '4:12' },
        architectures: ['amd64', 'arm64'],
        profiles: [['!cross'], ['pkg.x']],
      }],
    ]);
  });

  it('accepts package names with digits, plus, dot and hyphen', () => {
    expect(parseDependencies('libstdc++6, g++-12, python3.11, 0ad')).toEqual([
      [{ name: 'libstdc++6' }], [{ name: 'g++-12' }], [{ name: 'python3.11' }], [{ name: '0ad' }],
    ]);
  });

  it('tolerates extra whitespace and line breaks, as in a multi-line Depends', () => {
    const field = '\n libc6   (  >=   2.34  ) ,\n\tpython3:any\n  | python3  [ amd64 ]\n   <  !nocheck  > ,\n';
    expect(parseDependencies(field)).toEqual([
      [{ name: 'libc6', version: { operator: '>=', version: '2.34' } }],
      [{ name: 'python3', arch: 'any' }, { name: 'python3', architectures: ['amd64'], profiles: [['!nocheck']] }],
    ]);
  });

  it('gives [] for an empty or blank field and skips empty entries', () => {
    expect(parseDependencies('')).toEqual([]);
    expect(parseDependencies(' \n ')).toEqual([]);
    expect(parseDependencies('a,, b,')).toEqual([[{ name: 'a' }], [{ name: 'b' }]]);
  });

  it('throws a SyntaxError quoting the offending text', () => {
    expect(() => parseDependencies('a, b (>= 1')).toThrow(SyntaxError);
    expect(() => parseDependencies('a, b (>= 1')).toThrow('"b (>= 1"');
  });

  it.each([
    ['an empty alternative', 'a |', 'expected a package name'],
    ['an empty middle alternative', 'a | | b', 'expected a package name'],
    ['a leading symbol', '-a', 'expected a package name'],
    ['a substvar', '${misc:Depends}', 'expected a package name'],
    ['a missing operator', 'a (1.0)', 'unexpected "(1.0)"'],
    ['an unknown operator', 'a (== 1.0)', 'unexpected'],
    ['an unclosed parenthesis', 'a (>= 1.0', 'unexpected'],
    ['an empty version', 'a (>=)', 'unexpected'],
    ['an empty qualifier', 'a: (>= 1)', 'unexpected'],
    ['an empty architecture list', 'a []', 'empty architecture restriction'],
    ['an unclosed architecture list', 'a [amd64', 'unexpected'],
    ['an empty profile', 'a <>', 'empty build profile restriction'],
    ['an empty second profile', 'a <x> < >', 'empty build profile restriction'],
    ['parts out of order', 'a [amd64] (>= 1)', 'unexpected "(>= 1)"'],
    ['trailing garbage', 'a b', 'unexpected "b"'],
    ['a space inside a name', 'a b (= 1)', 'unexpected'],
  ])('throws for %s', (_label, field, message) => {
    expect(() => parseDependencies(field)).toThrow(SyntaxError);
    expect(() => parseDependencies(field)).toThrow(message);
  });

  it('stays fast on pathological whitespace', () => {
    const start = Date.now();
    expect(() => parseDependencies(`a${' '.repeat(50_000)}!`)).toThrow(SyntaxError);
    expect(() => parseDependencies(`a (>=${' '.repeat(50_000)}`)).toThrow(SyntaxError);
    expect(Date.now() - start).toBeLessThan(2000);
  });

  it('throws a RangeError for a format that is not supported', () => {
    expect(() => parseDependencies('a', 'rpm' as 'debian')).toThrow(RangeError);
  });

  it('accepts the debian format explicitly', () => {
    expect(parseDependencies('a (>= 1)', 'debian')).toEqual([[{ name: 'a', version: { operator: '>=', version: '1' } }]]);
  });
});
