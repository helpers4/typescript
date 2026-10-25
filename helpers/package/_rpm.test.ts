/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { parseRpm, stringifyRpm } from './_rpm';
import { parseDependencies } from './parseDependencies';
import { stringifyDependencies } from './stringifyDependencies';

describe('parseRpm', () => {
  it('parses a comma-separated Requires with and without versions', () => {
    expect(parseRpm('glibc >= 2.28, bash')).toEqual([
      [{ name: 'glibc', version: { operator: '>=', version: '2.28' } }],
      [{ name: 'bash' }],
    ]);
  });

  it('parses the five comparison operators', () => {
    for (const operator of ['<', '<=', '=', '>=', '>']) {
      expect(parseRpm(`pkg ${operator} 1.0`)).toEqual([[{ name: 'pkg', version: { operator, version: '1.0' } }]]);
    }
  });

  it('reads == as =', () => {
    expect(parseRpm('pkg == 1.0')).toEqual([[{ name: 'pkg', version: { operator: '=', version: '1.0' } }]]);
  });

  it('keeps epoch and release in the version', () => {
    expect(parseRpm('foo >= 1:2.0.1-3.fc40, bar = 0:1.2~rc1-1.el9')).toEqual([
      [{ name: 'foo', version: { operator: '>=', version: '1:2.0.1-3.fc40' } }],
      [{ name: 'bar', version: { operator: '=', version: '0:1.2~rc1-1.el9' } }],
    ]);
  });

  it('parses capabilities with parentheses, paths and special characters', () => {
    expect(parseRpm('perl(Foo::Bar) >= 1.2, libfoo.so.1()(64bit), /usr/bin/perl, config(foo) = 1.0-1')).toEqual([
      [{ name: 'perl(Foo::Bar)', version: { operator: '>=', version: '1.2' } }],
      [{ name: 'libfoo.so.1()(64bit)' }],
      [{ name: '/usr/bin/perl' }],
      [{ name: 'config(foo)', version: { operator: '=', version: '1.0-1' } }],
    ]);
    expect(parseRpm('rpmlib(CompressedFileNames) <= 3.0.4-1, pkgconfig(glib-2.0), libstdc++, _foo, g++~1, font(:lang=en)')).toEqual([
      [{ name: 'rpmlib(CompressedFileNames)', version: { operator: '<=', version: '3.0.4-1' } }],
      [{ name: 'pkgconfig(glib-2.0)' }],
      [{ name: 'libstdc++' }],
      [{ name: '_foo' }],
      [{ name: 'g++~1' }],
      [{ name: 'font(:lang=en)' }],
    ]);
  });

  it('balances nested parentheses inside a name', () => {
    expect(parseRpm('foo(bar(baz))(64bit) >= 1')).toEqual([[{ name: 'foo(bar(baz))(64bit)', version: { operator: '>=', version: '1' } }]]);
  });

  it('accepts newlines, tabs and runs of whitespace as separators', () => {
    expect(parseRpm('a\nb\t>=\t1.0\n\n  c,\n  d')).toEqual([
      [{ name: 'a' }],
      [{ name: 'b', version: { operator: '>=', version: '1.0' } }],
      [{ name: 'c' }],
      [{ name: 'd' }],
    ]);
  });

  it('accepts the operator on the next line', () => {
    expect(parseRpm('a\n>= 1')).toEqual([[{ name: 'a', version: { operator: '>=', version: '1' } }]]);
  });

  it('returns [] for an empty, blank or comma-only field', () => {
    expect(parseRpm('')).toEqual([]);
    expect(parseRpm(' \n\t ')).toEqual([]);
    expect(parseRpm(' , ,\n,')).toEqual([]);
  });

  it('treats a version without operator as another entry, like RPM', () => {
    expect(parseRpm('foo 1.0')).toEqual([[{ name: 'foo' }], [{ name: '1.0' }]]);
  });

  it('parses a rich dependency as alternatives', () => {
    expect(parseRpm('(nginx or httpd)')).toEqual([[{ name: 'nginx' }, { name: 'httpd' }]]);
    expect(parseRpm('(pkgA >= 3.2 or pkgB), c')).toEqual([
      [{ name: 'pkgA', version: { operator: '>=', version: '3.2' } }, { name: 'pkgB' }],
      [{ name: 'c' }],
    ]);
    expect(parseRpm('(a or b or c)')).toEqual([[{ name: 'a' }, { name: 'b' }, { name: 'c' }]]);
  });

  it('flattens nested or and accepts a single operand', () => {
    expect(parseRpm('(a or (b or c))')).toEqual([[{ name: 'a' }, { name: 'b' }, { name: 'c' }]]);
    expect(parseRpm('((a or b) or c = 1)')).toEqual([
      [{ name: 'a' }, { name: 'b' }, { name: 'c', version: { operator: '=', version: '1' } }],
    ]);
    expect(parseRpm('(a)')).toEqual([[{ name: 'a' }]]);
  });

  it('accepts a rich dependency over several lines and glued to a comma', () => {
    expect(parseRpm('(\n  a >= 1\n  or\n  b\n),(c or d)')).toEqual([
      [{ name: 'a', version: { operator: '>=', version: '1' } }, { name: 'b' }],
      [{ name: 'c' }, { name: 'd' }],
    ]);
  });

  it.each(['and', 'if', 'unless', 'with', 'without', 'else'])('refuses the rich operator "%s"', (operator) => {
    const field = `(a ${operator} b)`;
    expect(() => parseRpm(field)).toThrow(SyntaxError);
    expect(() => parseRpm(field)).toThrow(`the rich dependency operator "${operator}" is not supported`);
  });

  it('refuses an unsupported operator in a nested rich dependency', () => {
    expect(() => parseRpm('((a and b) or c)')).toThrow(/operator "and" is not supported/);
    expect(() => parseRpm('(a or (b with c))')).toThrow(/operator "with" is not supported/);
    expect(() => parseRpm('(x if y else z)')).toThrow(/operator "if" is not supported/);
  });

  it.each([
    ['a >=', 'operator ">=" without a version'],
    ['a >= , b', 'operator ">=" without a version'],
    ['a >=\n', 'operator ">=" without a version'],
    ['a <> 1', 'unknown operator "<>"'],
    ['a != 1', 'unknown operator "!="'],
    ['a => 1', 'unknown operator "=>"'],
    ['a >=1', 'an operator must be surrounded by whitespace'],
    ['a>=1', 'an operator must be surrounded by whitespace'],
    ['a >= >= 1', 'unexpected ">=" after the operator ">="'],
    ['>= 1', 'expected a capability name'],
    ['a, = 1', 'expected a capability name'],
    ['-a', 'expected a capability name'],
    ['a, %{name}', 'expected a capability name'],
    ['a)', 'unbalanced parentheses'],
    [')', 'expected a capability name'],
    ['perl(Foo', 'unbalanced parentheses'],
    ['perl(Foo bar)', 'unbalanced parentheses'],
    ['perl(Foo,bar)', 'unbalanced parentheses'],
    ['a >= 1)', 'unbalanced parentheses'],
    ['(a or b', 'unbalanced parentheses'],
    ['(a or b) )', 'expected a capability name'],
    ['(a or b)c', 'unbalanced parentheses'],
    ['(', 'unbalanced parentheses'],
    ['(a or', 'unbalanced parentheses'],
    ['()', 'empty rich dependency'],
    ['(  )', 'empty rich dependency'],
    ['(a or )', 'expected a capability after "or"'],
    ['(a or ())', 'empty rich dependency'],
    ['(a b)', 'expected "or" or ")" but found "b"'],
    ['(a, b)', 'unexpected "," in a rich dependency'],
    ['(a (b))', 'unexpected "(" in a rich dependency'],
    ['(or a)', 'expected "or" or ")" but found "a"'],
    ['(a >=)', 'operator ">=" without a version'],
    ['(a >= 1 b)', 'expected "or" or ")" but found "b"'],
    ['(a or , b)', 'expected a capability name'],
  ])('refuses %j', (field, message) => {
    expect(() => parseRpm(field)).toThrow(SyntaxError);
    expect(() => parseRpm(field)).toThrow(message);
  });

  it('refuses rich dependencies nested too deeply instead of overflowing the stack', () => {
    expect(parseRpm(`${'('.repeat(100)}a${')'.repeat(100)}`)).toEqual([[{ name: 'a' }]]);
    expect(() => parseRpm(`${'('.repeat(101)}a${')'.repeat(101)}`)).toThrow(/nested more than 100 levels deep/);
    expect(() => parseRpm('('.repeat(50_000))).toThrow(SyntaxError);
  });

  it('reports the offending entry and the whole field', () => {
    expect(() => parseRpm('good, bad >= , other')).toThrow('in "bad >= " (field "good, bad >= , other")');
    expect(() => parseRpm('x, (a and b)')).toThrow('(field "x, (a and b)")');
  });

  it('stays linear on adversarial input', () => {
    const inputs = [
      '('.repeat(50_000),
      `a${'('.repeat(50_000)}`,
      `(${'a or '.repeat(10_000)}`,
      `a${' '.repeat(50_000)}>=`,
      `${'a >= '.repeat(10_000)}`,
      `${'((a or b) or '.repeat(4_000)}c`,
      `a(${'b('.repeat(25_000)}`,
      ' ,'.repeat(25_000),
    ];
    const started = performance.now();
    for (const input of inputs) {
      try {
        parseRpm(input);
      } catch (error) {
        expect(error).toBeInstanceOf(SyntaxError);
      }
    }
    expect(performance.now() - started).toBeLessThan(1_000);
  });
});

describe('stringifyRpm', () => {
  it('writes entries separated by ", "', () => {
    expect(stringifyRpm([[{ name: 'glibc', version: { operator: '>=', version: '2.28' } }], [{ name: 'bash' }]])).toBe('glibc >= 2.28, bash');
  });

  it('writes alternatives in parentheses and single entries without', () => {
    expect(stringifyRpm([[{ name: 'nginx' }, { name: 'httpd', version: { operator: '<', version: '3' } }], [{ name: 'perl(Foo::Bar)' }]])).toBe(
      '(nginx or httpd < 3), perl(Foo::Bar)',
    );
  });

  it('writes nothing for an empty group or no group', () => {
    expect(stringifyRpm([])).toBe('');
    expect(stringifyRpm([[], [{ name: 'a' }], []])).toBe('a');
  });

  it('round-trips real fields', () => {
    for (const field of [
      'glibc >= 2.28, bash',
      '(nginx or httpd)',
      'perl(Foo::Bar) >= 1.2, libfoo.so.1()(64bit), /usr/bin/perl',
      'foo >= 1:2.0-3, (a >= 1 or b = 2 or c)',
    ]) {
      expect(stringifyRpm(parseRpm(field))).toBe(field);
    }
    const parsed = parseRpm('a\n(b or\n c),\td == 1');
    expect(parseRpm(stringifyRpm(parsed))).toEqual(parsed);
  });
});

describe('the rpm format of the public functions', () => {
  it('is dispatched by parseDependencies and stringifyDependencies', () => {
    expect(parseDependencies('bash, (a or b >= 1)', 'rpm')).toEqual([
      [{ name: 'bash' }],
      [{ name: 'a' }, { name: 'b', version: { operator: '>=', version: '1' } }],
    ]);
    expect(stringifyDependencies([[{ name: 'bash' }], [{ name: 'a' }, { name: 'b' }]], 'rpm')).toBe('bash, (a or b)');
  });
});
