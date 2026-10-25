/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { parseDependencies as parseAny } from './parseDependencies';
import { stringifyDependencies as stringifyAny } from './stringifyDependencies';
import type { ArchDependency, DependencyGroup } from './types';

// The Arch format of the public functions, with the format left implicit to keep the cases short.
const parseDependencies = (field: string) => parseAny(field, 'arch');
const stringifyDependencies = (groups: readonly DependencyGroup<ArchDependency>[]) => stringifyAny(groups, 'arch');

describe('parseDependencies — arch', () => {
  it('parses a PKGBUILD depends array', () => {
    expect(parseDependencies("('glibc' 'gcc-libs>=13' 'python>=3.11')")).toEqual([
      [{ name: 'glibc' }],
      [{ name: 'gcc-libs', version: { operator: '>=', version: '13' } }],
      [{ name: 'python', version: { operator: '>=', version: '3.11' } }],
    ]);
  });

  it('parses a multi-line array with comments, double quotes and an epoch version', () => {
    const field = `(
      # runtime
      "bash"   # the shell
      'foo>=1:2.0-3'
      'libfoo.so=6-64'
      # nothing after this one
    )`;
    expect(parseDependencies(field)).toEqual([
      [{ name: 'bash' }],
      [{ name: 'foo', version: { operator: '>=', version: '1:2.0-3' } }],
      [{ name: 'libfoo.so', version: { operator: '=', version: '6-64' } }],
    ]);
  });

  it('parses a bare list separated by spaces and new lines', () => {
    expect(parseDependencies('glibc  gtk3>=3.24\nlibx11\t')).toEqual([
      [{ name: 'glibc' }],
      [{ name: 'gtk3', version: { operator: '>=', version: '3.24' } }],
      [{ name: 'libx11' }],
    ]);
  });

  it('parses the five operators, the two-character ones first', () => {
    for (const operator of ['<=', '>=', '<', '>', '=']) {
      expect(parseDependencies(`pkg${operator}1.0`)).toEqual([[{ name: 'pkg', version: { operator, version: '1.0' } }]]);
    }
    expect(parseDependencies('a<=1 b>=2')).toEqual([
      [{ name: 'a', version: { operator: '<=', version: '1' } }],
      [{ name: 'b', version: { operator: '>=', version: '2' } }],
    ]);
  });

  it('accepts the characters of the pkgname rule and the usual version shapes', () => {
    expect(parseDependencies('@scope_x+y.z-1 c++ _a')).toEqual([
      [{ name: '@scope_x+y.z-1' }],
      [{ name: 'c++' }],
      [{ name: '_a' }],
    ]);
    expect(parseDependencies('a=2.0.r5+g1a2b3c-1 b>=1.0~rc1 c<2_beta')).toEqual([
      [{ name: 'a', version: { operator: '=', version: '2.0.r5+g1a2b3c-1' } }],
      [{ name: 'b', version: { operator: '>=', version: '1.0~rc1' } }],
      [{ name: 'c', version: { operator: '<', version: '2_beta' } }],
    ]);
  });

  it('gives each entry its own group of one alternative', () => {
    const groups = parseDependencies('a b');
    expect(groups).toHaveLength(2);
    expect(groups.every((group) => group.length === 1)).toBe(true);
  });

  it('accepts closely written parentheses and quotes', () => {
    expect(parseDependencies("('a' \"b\")")).toEqual([[{ name: 'a' }], [{ name: 'b' }]]);
    expect(parseDependencies("('a'\n'b')")).toEqual([[{ name: 'a' }], [{ name: 'b' }]]);
    expect(parseDependencies('(a b)')).toEqual([[{ name: 'a' }], [{ name: 'b' }]]);
    expect(parseDependencies("(a)  # trailing comment\n")).toEqual([[{ name: 'a' }]]);
  });

  it('returns [] for an empty field, whitespace or an empty array', () => {
    expect(parseDependencies('')).toEqual([]);
    expect(parseDependencies(' \n\t ')).toEqual([]);
    expect(parseDependencies('()')).toEqual([]);
    expect(parseDependencies('( # nothing\n )')).toEqual([]);
  });

  it('refuses a space around a version operator', () => {
    expect(() => parseDependencies('glibc >= 2')).toThrow(SyntaxError);
    expect(() => parseDependencies('glibc >=2')).toThrow('a version operator must follow the package name without a space in ">=2"');
    expect(() => parseDependencies('glibc>= 2')).toThrow(/empty version after ">=" \(no space is allowed around a version operator\) in "glibc>="/);
    expect(() => parseDependencies("'glibc >= 2'")).toThrow('whitespace inside an entry (no space is allowed around a version operator) in "glibc >= 2"');
  });

  it('refuses optdepends descriptions', () => {
    expect(() => parseDependencies("('python: for bindings')")).toThrow(SyntaxError);
    expect(() => parseDependencies("('python: for bindings')")).toThrow('optdepends descriptions ("name: description") are not supported in "python: for bindings"');
    expect(() => parseDependencies('python: bindings')).toThrow(/optdepends descriptions .* in "python:"/);
    expect(() => parseDependencies('python>=3:')).toThrow(/optdepends descriptions/);
  });

  it('refuses an invalid name', () => {
    expect(() => parseDependencies('-a')).toThrow('expected a package name in "-a"');
    expect(() => parseDependencies('.a')).toThrow('expected a package name in ".a"');
    expect(() => parseDependencies("''")).toThrow('expected a package name in ""');
    expect(() => parseDependencies('é')).toThrow('expected a package name');
  });

  it('refuses an invalid operator, version or trailing text', () => {
    expect(() => parseDependencies('a$b')).toThrow('unexpected "$b" in "a$b"');
    expect(() => parseDependencies('a==1')).toThrow('invalid version "=1" in "a==1"');
    expect(() => parseDependencies('a>=-1')).toThrow('invalid version "-1" in "a>=-1"');
    expect(() => parseDependencies('a>=')).toThrow('empty version after ">="');
    expect(() => parseDependencies('a>=1$')).toThrow('unexpected "$" in "a>=1$"');
    expect(() => parseDependencies('a>=1>=2')).toThrow('unexpected ">=2" in "a>=1>=2"');
  });

  it('reports the whole field in every error', () => {
    expect(() => parseDependencies('ok -bad')).toThrow('parseDependencies: expected a package name in "-bad" (field "ok -bad")');
  });

  it('refuses unterminated quotes', () => {
    expect(() => parseDependencies("('a)")).toThrow(SyntaxError);
    expect(() => parseDependencies("('a)")).toThrow('unterminated quote in "\'a)"');
    expect(() => parseDependencies('"a')).toThrow('unterminated quote');
    expect(() => parseDependencies("'a\"")).toThrow('unterminated quote');
  });

  it('refuses text glued to a closing quote', () => {
    expect(() => parseDependencies("'a'b")).toThrow('unexpected text after a quoted entry');
    expect(() => parseDependencies("'a'#c")).toThrow('unexpected text after a quoted entry');
  });

  it('refuses unbalanced parentheses', () => {
    expect(() => parseDependencies('(a b')).toThrow('unbalanced parenthesis: missing ")" in "(" (field "(a b")');
    expect(() => parseDependencies('a b)')).toThrow('unbalanced parenthesis: unexpected ")" in ")"');
    expect(() => parseDependencies(')')).toThrow(SyntaxError);
    expect(() => parseDependencies('(a))')).toThrow('unexpected text after the closing parenthesis in ")"');
    expect(() => parseDependencies('(a) b')).toThrow('unexpected text after the closing parenthesis in "b"');
    expect(() => parseDependencies('(a) (b)')).toThrow(SyntaxError);
    expect(() => parseDependencies('((a))')).toThrow('unexpected "(" in "(a))"');
    expect(() => parseDependencies('a (b)')).toThrow('unexpected "(" in "(b)"');
  });

  it('does not treat # as a comment outside an array', () => {
    expect(() => parseDependencies('a # note')).toThrow('expected a package name in "#"');
  });

  it('stays linear on adversarial input', () => {
    const inputs = [
      'a>'.repeat(25_000),
      '('.repeat(50_000),
      "'".repeat(50_000),
      `(${'a '.repeat(25_000)}`,
      `${'a'.repeat(49_999)}$`,
      `a>=${'1'.repeat(49_990)}$`,
      `(${'#'.repeat(50_000)}`,
    ];
    for (const input of inputs) {
      const start = performance.now();
      try {
        parseDependencies(input);
      } catch (error) {
        expect(error).toBeInstanceOf(SyntaxError);
      }
      expect(performance.now() - start).toBeLessThan(1000);
    }
  });
});

describe('stringifyDependencies — arch', () => {
  it('writes entries separated by a space, without quotes or parentheses', () => {
    expect(
      stringifyDependencies([
        [{ name: 'glibc' }],
        [{ name: 'gcc-libs', version: { operator: '>=', version: '13' } }],
        [{ name: 'foo', version: { operator: '<', version: '1:2.0-3' } }],
      ]),
    ).toBe('glibc gcc-libs>=13 foo<1:2.0-3');
  });

  it('writes nothing for no groups or an empty group', () => {
    expect(stringifyDependencies([])).toBe('');
    expect(stringifyDependencies([[]])).toBe('');
    expect(stringifyDependencies([[{ name: 'a' }], [], [{ name: 'b' }]])).toBe('a b');
  });

  it('throws a RangeError for a group with alternatives', () => {
    expect(() => stringifyDependencies([[{ name: 'a' }, { name: 'b' }]])).toThrow(RangeError);
    expect(() => stringifyDependencies([[{ name: 'a' }, { name: 'b' }]])).toThrow('has no alternatives (a group has 2)');
  });

  it('round-trips through parseDependencies', () => {
    const groups: DependencyGroup<ArchDependency>[] = [
      [{ name: 'glibc' }],
      [{ name: 'libfoo.so', version: { operator: '=', version: '6-64' } }],
      [{ name: 'python', version: { operator: '>=', version: '1:3.11-2' } }],
    ];
    expect(parseDependencies(stringifyDependencies(groups))).toEqual(groups);
    expect(stringifyDependencies(parseDependencies("('a<=1' b)"))).toBe('a<=1 b');
  });
});
