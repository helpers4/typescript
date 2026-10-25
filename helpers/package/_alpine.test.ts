/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { parseDependencies as parseAny } from './parseDependencies';
import { stringifyDependencies as stringifyAny } from './stringifyDependencies';
import type { AlpineDependency, DependencyGroup } from './types';

const parseDependencies = (field: string) => parseAny(field, 'alpine');
const stringifyDependencies = (groups: readonly DependencyGroup<AlpineDependency>[]) => stringifyAny(groups, 'alpine');

describe('parseDependencies — alpine', () => {
  it('parses an APKBUILD depends with versions, conflicts and virtuals', () => {
    expect(parseDependencies('musl>=1.2.4 busybox !openrc so:libc.musl-x86_64.so.1 cmd:sh pc:glib-2.0>=2.76')).toEqual([
      [{ name: 'musl', version: { operator: '>=', version: '1.2.4' } }],
      [{ name: 'busybox' }],
      [{ name: 'openrc', conflict: true }],
      [{ name: 'so:libc.musl-x86_64.so.1' }],
      [{ name: 'cmd:sh' }],
      [{ name: 'pc:glib-2.0', version: { operator: '>=', version: '2.76' } }],
    ]);
  });

  it('parses every operator apk writes', () => {
    for (const operator of ['<', '<=', '=', '>=', '>', '~', '<~', '>~']) {
      expect(parseDependencies(`foo${operator}1.2_p3-r0`)).toEqual([
        [{ name: 'foo', version: { operator, version: '1.2_p3-r0' } }],
      ]);
    }
  });

  it('parses the fuzzy prefix match and a conflict with a version', () => {
    expect(parseDependencies('foo~1.2 !bar<2')).toEqual([
      [{ name: 'foo', version: { operator: '~', version: '1.2' } }],
      [{ name: 'bar', conflict: true, version: { operator: '<', version: '2' } }],
    ]);
  });

  it('parses the identity hash operator, whose version has base64 characters', () => {
    expect(parseDependencies('busybox><Q12l/v/T0pPK3aQaUWmI9djiLpF+g=')).toEqual([
      [{ name: 'busybox', version: { operator: '><', version: 'Q12l/v/T0pPK3aQaUWmI9djiLpF+g=' } }],
    ]);
  });

  it('accepts the characters of apk names: + _ . - @ / : [ ]', () => {
    expect(parseDependencies('g++ py3_x.y-z busybox@edge /bin/sh so:libz.so.1 perl[x]')).toEqual([
      [{ name: 'g++' }], [{ name: 'py3_x.y-z' }], [{ name: 'busybox@edge' }],
      [{ name: '/bin/sh' }], [{ name: 'so:libz.so.1' }], [{ name: 'perl[x]' }],
    ]);
  });

  it('splits on any whitespace, as the shell does for depends="..."', () => {
    expect(parseDependencies('\n\ta>=1\n\t  b \r\n  !c\t\n')).toEqual([
      [{ name: 'a', version: { operator: '>=', version: '1' } }],
      [{ name: 'b' }],
      [{ name: 'c', conflict: true }],
    ]);
  });

  it('gives [] for an empty or blank field', () => {
    expect(parseDependencies('')).toEqual([]);
    expect(parseDependencies(' \n\t ')).toEqual([]);
  });

  it('puts each entry in its own group of one alternative', () => {
    expect(parseDependencies('a b').map((group) => group.length)).toEqual([1, 1]);
  });

  it('throws a SyntaxError quoting the entry and the field', () => {
    expect(() => parseDependencies('a b>= c')).toThrow(SyntaxError);
    expect(() => parseDependencies('a b>= c')).toThrow('parseDependencies: expected a version after the operator in "b>=" (field "a b>= c")');
  });

  it.each([
    ['an empty name', '!', 'expected a package name'],
    ['a name starting with an operator', '>=1', 'expected a package name'],
    ['a double conflict mark', '!!a', 'expected a package name'],
    ['a stray character in a name', 'a,b', 'unexpected ",b"'],
    ['a conflict mark inside a name', 'a!b', 'unexpected "!b"'],
    ['a missing version', 'a>=', 'expected a version after the operator'],
    ['a missing version after a tilde', 'a~', 'expected a version after the operator'],
    ['an unsupported operator', 'a==1', 'unsupported operator "=="'],
    ['a reversed operator', 'a=<1', 'unsupported operator "=<"'],
    ['an angle pair', 'a<>1', 'unsupported operator "<>"'],
    ['an operator inside the version', 'a>=1<2', 'unexpected "1<2"'],
    ['a double quote', 'depends="a b"', 'quotes are not part of the format'],
    ['a single quote', "a 'b'", 'quotes are not part of the format'],
    ['a quote after a name', "a'", 'quotes are not part of the format'],
  ])('throws for %s', (_label, field, message) => {
    expect(() => parseDependencies(field)).toThrow(SyntaxError);
    expect(() => parseDependencies(field)).toThrow(message);
  });

  it('treats spaces around the operator as separate, invalid entries', () => {
    expect(() => parseDependencies('a >= 1')).toThrow('expected a package name');
    expect(() => parseDependencies('a >=1')).toThrow(SyntaxError);
  });

  it('stays fast on a 50k-character adversarial input', () => {
    const start = Date.now();
    expect(() => parseDependencies(`a${'>'.repeat(50_000)}`)).toThrow(SyntaxError);
    expect(() => parseDependencies(`a>=${'<'.repeat(50_000)}`)).toThrow(SyntaxError);
    expect(() => parseDependencies(`${' '.repeat(50_000)}!`)).toThrow(SyntaxError);
    expect(() => parseDependencies(`${'a '.repeat(25_000)}!`)).toThrow(SyntaxError);
    expect(() => parseDependencies(`${'!'.repeat(50_000)}a`)).toThrow(SyntaxError);
    expect(Date.now() - start).toBeLessThan(2000);
  });
});

describe('stringifyDependencies — alpine', () => {
  it('returns an empty string for no groups', () => {
    expect(stringifyDependencies([])).toBe('');
  });

  it('writes entries on one line, joined by a single space', () => {
    expect(stringifyDependencies([
      [{ name: 'musl', version: { operator: '>=', version: '1.2.4' } }],
      [{ name: 'busybox' }],
      [{ name: 'openrc', conflict: true }],
      [{ name: 'foo', conflict: true, version: { operator: '~', version: '1.2' } }],
      [{ name: 'pc:glib-2.0', version: { operator: '>=', version: '2.76' } }],
    ])).toBe('musl>=1.2.4 busybox !openrc !foo~1.2 pc:glib-2.0>=2.76');
  });

  it('writes nothing for an empty group', () => {
    expect(stringifyDependencies([[], [{ name: 'a' }], []])).toBe('a');
  });

  it('throws a RangeError for a group with alternatives', () => {
    expect(() => stringifyDependencies([[{ name: 'a' }, { name: 'b' }]])).toThrow(RangeError);
    expect(() => stringifyDependencies([[{ name: 'a' }, { name: 'b' }]])).toThrow('no alternatives');
  });

  it('round-trips a parsed field and a built list', () => {
    const field = 'musl>=1.2.4 busybox !openrc so:libc.musl-x86_64.so.1 foo~1.2 bar<=3 baz><Q1a+/=';
    expect(stringifyDependencies(parseDependencies(field))).toBe(field);
    const groups: DependencyGroup<AlpineDependency>[] = [
      [{ name: 'a', conflict: true, version: { operator: '<~', version: '1' } }],
      [{ name: 'b' }],
    ];
    expect(parseDependencies(stringifyDependencies(groups))).toEqual(groups);
  });
});
