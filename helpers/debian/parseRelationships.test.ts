/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { parseRelationships } from './parseRelationships';

describe('parseRelationships', () => {
  it('parses the full syntax: versions, alternatives, architecture qualifier, restrictions, profiles', () => {
    expect(parseRelationships('libc6 (>= 2.34), python3:any | python3 (>= 3.8) [amd64], foo <!nocheck>')).toEqual([
      [{ name: 'libc6', version: { operator: '>=', version: '2.34' } }],
      [
        { name: 'python3', arch: 'any' },
        { name: 'python3', version: { operator: '>=', version: '3.8' }, architectures: ['amd64'] },
      ],
      [{ name: 'foo', profiles: [['!nocheck']] }],
    ]);
  });

  it('parses a bare name and the five Policy operators', () => {
    expect(parseRelationships('a')).toEqual([[{ name: 'a' }]]);
    const operators = ['<<', '<=', '=', '>=', '>>'];
    for (const operator of operators) {
      expect(parseRelationships(`pkg (${operator} 1:2.0-1~rc1)`)).toEqual([
        [{ name: 'pkg', version: { operator, version: '1:2.0-1~rc1' } }],
      ]);
    }
  });

  it('accepts the obsolete < and > and reports them as written', () => {
    expect(parseRelationships('a (< 2), b (> 1)')).toEqual([
      [{ name: 'a', version: { operator: '<', version: '2' } }],
      [{ name: 'b', version: { operator: '>', version: '1' } }],
    ]);
  });

  it('parses architecture restrictions with negations', () => {
    expect(parseRelationships('libfoo [!i386 !armel], bar [linux-any]')).toEqual([
      [{ name: 'libfoo', architectures: ['!i386', '!armel'] }],
      [{ name: 'bar', architectures: ['linux-any'] }],
    ]);
  });

  it('parses several build profile groups, each with AND-ed terms', () => {
    expect(parseRelationships('dh-python <!nocheck cross> <stage1>')).toEqual([
      [{ name: 'dh-python', profiles: [['!nocheck', 'cross'], ['stage1']] }],
    ]);
  });

  it('parses every part together, in order', () => {
    expect(parseRelationships('gcc:native (>> 4:12) [amd64 arm64] <!cross> <pkg.x>')).toEqual([
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
    expect(parseRelationships('libstdc++6, g++-12, python3.11, 0ad')).toEqual([
      [{ name: 'libstdc++6' }], [{ name: 'g++-12' }], [{ name: 'python3.11' }], [{ name: '0ad' }],
    ]);
  });

  it('tolerates extra whitespace and line breaks, as in a multi-line Depends', () => {
    const field = '\n libc6   (  >=   2.34  ) ,\n\tpython3:any\n  | python3  [ amd64 ]\n   <  !nocheck  > ,\n';
    expect(parseRelationships(field)).toEqual([
      [{ name: 'libc6', version: { operator: '>=', version: '2.34' } }],
      [{ name: 'python3', arch: 'any' }, { name: 'python3', architectures: ['amd64'], profiles: [['!nocheck']] }],
    ]);
  });

  it('gives [] for an empty or blank field and skips empty entries', () => {
    expect(parseRelationships('')).toEqual([]);
    expect(parseRelationships(' \n ')).toEqual([]);
    expect(parseRelationships('a,, b,')).toEqual([[{ name: 'a' }], [{ name: 'b' }]]);
  });

  it('throws a SyntaxError quoting the offending text', () => {
    expect(() => parseRelationships('a, b (>= 1')).toThrow(SyntaxError);
    expect(() => parseRelationships('a, b (>= 1')).toThrow('"b (>= 1"');
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
    expect(() => parseRelationships(field)).toThrow(SyntaxError);
    expect(() => parseRelationships(field)).toThrow(message);
  });

  it('stays fast on pathological whitespace', () => {
    const start = Date.now();
    expect(() => parseRelationships(`a${' '.repeat(50_000)}!`)).toThrow(SyntaxError);
    expect(() => parseRelationships(`a (>=${' '.repeat(50_000)}`)).toThrow(SyntaxError);
    expect(Date.now() - start).toBeLessThan(2000);
  });
});
