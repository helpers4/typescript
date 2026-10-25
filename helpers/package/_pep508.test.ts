/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { parseDependencies as parseAny } from './parseDependencies';
import { stringifyDependencies as stringifyAny } from './stringifyDependencies';
import type { DependencyGroup, Pep508Dependency } from './types';

// The PEP 508 format of the public functions, with the format left implicit to keep the cases short.
const parseDependencies = (field: string) => parseAny(field, 'pep508');
const stringifyDependencies = (groups: readonly DependencyGroup<Pep508Dependency>[]) => stringifyAny(groups, 'pep508');

/** The single requirement of a one-line field. */
const one = (text: string): Pep508Dependency => parseDependencies(text)[0]![0]!;

describe('parseDependencies — pep508', () => {
  it('parses the examples of PEP 508', () => {
    expect(one('requests [security,tests] >= 2.8.1, == 2.8.* ; python_version < "2.7"')).toEqual({
      name: 'requests',
      extras: ['security', 'tests'],
      specifiers: [
        { operator: '>=', version: '2.8.1' },
        { operator: '==', version: '2.8.*' },
      ],
      marker: 'python_version < "2.7"',
    });
    expect(one('name @ https://example.com/pkg.whl')).toEqual({
      name: 'name',
      extras: [],
      specifiers: [],
      url: 'https://example.com/pkg.whl',
    });
    expect(one('pip @ https://github.com/pypa/pip/archive/1.3.1.zip#sha1=da9234ee9982d4bbb3c72346a6de940a148ea686')).toMatchObject({
      name: 'pip',
      url: 'https://github.com/pypa/pip/archive/1.3.1.zip#sha1=da9234ee9982d4bbb3c72346a6de940a148ea686',
    });
    expect(one('name>=3')).toEqual({ name: 'name', extras: [], specifiers: [{ operator: '>=', version: '3' }] });
    expect(one('name>=3,<2')).toMatchObject({ specifiers: [{ operator: '>=', version: '3' }, { operator: '<', version: '2' }] });
    expect(one('A')).toEqual({ name: 'A', extras: [], specifiers: [] });
    expect(one('Twisted[tls] ; sys_platform == "win32" and (python_version < "3.9" or os_name == \'nt\')')).toEqual({
      name: 'Twisted',
      extras: ['tls'],
      specifiers: [],
      marker: 'sys_platform == "win32" and (python_version < "3.9" or os_name == \'nt\')',
    });
  });

  it('keeps the name, the extras and the specifiers as written, in order', () => {
    expect(one('My.Pkg_name-2[Zeta, alpha ,Beta.1]<=3.0 , ~=1.4.2')).toEqual({
      name: 'My.Pkg_name-2',
      extras: ['Zeta', 'alpha', 'Beta.1'],
      specifiers: [{ operator: '<=', version: '3.0' }, { operator: '~=', version: '1.4.2' }],
    });
  });

  it('reads every operator, the longest first', () => {
    for (const operator of ['~=', '==', '!=', '<=', '>=', '<', '>', '===']) {
      expect(one(`a ${operator} 1.0`).specifiers).toEqual([{ operator, version: '1.0' }]);
      expect(one(`a${operator}1.0`).specifiers).toEqual([{ operator, version: '1.0' }]);
    }
    expect(one('a===foo-bar').specifiers).toEqual([{ operator: '===', version: 'foo-bar' }]);
  });

  it('accepts wildcards after == and !=, and nowhere else', () => {
    expect(one('a ==1.*, !=2.0.*').specifiers).toEqual([{ operator: '==', version: '1.*' }, { operator: '!=', version: '2.0.*' }]);
    for (const operator of ['~=', '<=', '>=', '<', '>']) {
      expect(() => parseDependencies(`a ${operator} 1.*`)).toThrow(`the wildcard "*" is not allowed with "${operator}"`);
    }
  });

  it('accepts the legacy parentheses around the specifiers', () => {
    expect(one('a (>=1.0,<2)').specifiers).toEqual([{ operator: '>=', version: '1.0' }, { operator: '<', version: '2' }]);
    expect(one('a[x]( >= 1.0 , < 2 ) ; os_name == "nt"')).toEqual({
      name: 'a',
      extras: ['x'],
      specifiers: [{ operator: '>=', version: '1.0' }, { operator: '<', version: '2' }],
      marker: 'os_name == "nt"',
    });
  });

  it('accepts empty extras', () => {
    expect(one('a[]>=1').extras).toEqual([]);
    expect(one('a [ ] ').extras).toEqual([]);
  });

  it('takes everything after the first ";" as the marker, trimmed and unparsed', () => {
    expect(one('a;python_version<"3"').marker).toBe('python_version<"3"');
    expect(one('a ;   extra == "x;y" ;').marker).toBe('extra == "x;y" ;');
    expect(one('a ; platform_machine != "x(86"').marker).toBe('platform_machine != "x(86"');
    expect(one('a ; nonsense_variable ~~ "()"').marker).toBe('nonsense_variable ~~ "()"');
  });

  it('reads a URL up to the next whitespace, so a marker needs whitespace before the ";"', () => {
    expect(one('a @ https://x.org/p.whl ; python_version < "3"')).toEqual({
      name: 'a',
      extras: [],
      specifiers: [],
      url: 'https://x.org/p.whl',
      marker: 'python_version < "3"',
    });
    expect(one('a @ https://x.org/p.whl;marker')).toMatchObject({ url: 'https://x.org/p.whl;marker' });
    expect(() => parseDependencies('a @ https://x.org/p.whl; python_version < "3"')).toThrow('unexpected "python_version < "3""');
    expect(one('a[x]@file:///tmp/p.tar.gz')).toMatchObject({ extras: ['x'], url: 'file:///tmp/p.tar.gz' });
  });

  it('returns an empty list for an empty or blank field', () => {
    expect(parseDependencies('')).toEqual([]);
    expect(parseDependencies('  \n\t\n  ')).toEqual([]);
    expect(parseDependencies('# nothing\n\n')).toEqual([]);
    expect(parseDependencies('\\')).toEqual([]);
  });

  it('parses a requirements file: one group of one alternative per line, with comments and continuations', () => {
    const file = [
      '# runtime dependencies',
      'requests[security] >= 2.8.1  # the HTTP client',
      '',
      '   # an indented comment',
      'numpy>=1.20, \\',
      '      <2.0',
      'flask @ https://example.com/flask.whl#egg=flask',
      "tomli>=1.1.0 ; python_version < '3.11'",
      '',
    ].join('\n');
    expect(parseDependencies(file)).toEqual([
      [{ name: 'requests', extras: ['security'], specifiers: [{ operator: '>=', version: '2.8.1' }] }],
      [{ name: 'numpy', extras: [], specifiers: [{ operator: '>=', version: '1.20' }, { operator: '<', version: '2.0' }] }],
      [{ name: 'flask', extras: [], specifiers: [], url: 'https://example.com/flask.whl#egg=flask' }],
      [{ name: 'tomli', extras: [], specifiers: [{ operator: '>=', version: '1.1.0' }], marker: "python_version < '3.11'" }],
    ]);
  });

  it('handles Windows line endings', () => {
    expect(parseDependencies('a>=1\r\nb \\\r\n  <2\r\n')).toEqual([
      [{ name: 'a', extras: [], specifiers: [{ operator: '>=', version: '1' }] }],
      [{ name: 'b', extras: [], specifiers: [{ operator: '<', version: '2' }] }],
    ]);
  });

  it('strips an inline comment only after whitespace or at the start of the line', () => {
    expect(one('a # comment')).toEqual({ name: 'a', extras: [], specifiers: [] });
    expect(one('a\t#comment')).toEqual({ name: 'a', extras: [], specifiers: [] });
    expect(one('a @ https://x.org/p.whl#sha=1')).toMatchObject({ url: 'https://x.org/p.whl#sha=1' });
    expect(parseDependencies('#a\nb')).toEqual([[{ name: 'b', extras: [], specifiers: [] }]]);
  });

  it('continues a line over a backslash, also over a comment line and at the end of the field', () => {
    expect(parseDependencies('a \\\n>=1')).toEqual([[{ name: 'a', extras: [], specifiers: [{ operator: '>=', version: '1' }] }]]);
    expect(parseDependencies('a \\\n# trailing comment\nb')).toEqual([
      [{ name: 'a', extras: [], specifiers: [] }],
      [{ name: 'b', extras: [], specifiers: [] }],
    ]);
    expect(parseDependencies('a \\')).toEqual([[{ name: 'a', extras: [], specifiers: [] }]]);
  });

  describe('errors', () => {
    const syntaxError = (text: string, reason: string | RegExp) => {
      expect(() => parseDependencies(text)).toThrow(SyntaxError);
      expect(() => parseDependencies(text)).toThrow(reason);
    };

    it('names the requirement and the whole field', () => {
      expect(() => parseDependencies('good\nbad >=\nalso-good')).toThrow(
        'parseDependencies: expected a version after ">=" in "bad >=" (field "good\nbad >=\nalso-good")',
      );
    });

    it('refuses pip options', () => {
      syntaxError('-r other.txt', 'pip options such as "-r" or "--index-url" are not supported');
      syntaxError('a\n--index-url https://example.org/simple', /pip options/);
    });

    it('refuses a missing or invalid name', () => {
      syntaxError('>=1.0', 'expected a distribution name');
      syntaxError('[extra]', 'expected a distribution name');
      syntaxError('_a', 'expected a distribution name');
      syntaxError('a-', 'expected a version operator');
    });

    it('refuses bad extras', () => {
      syntaxError('a[x', 'unclosed "[" in the extras');
      syntaxError('a[x y]', 'invalid extra "x y"');
      syntaxError('a[x,,y]', 'invalid extra ""');
      syntaxError('a[x,]', 'invalid extra ""');
      syntaxError('a[-x]', 'invalid extra "-x"');
    });

    it('refuses a bad URL requirement', () => {
      syntaxError('a @', 'expected a URL after "@"');
      syntaxError('a @   ', 'expected a URL after "@"');
      syntaxError('a @ https://x.org/p.whl extra', 'unexpected "extra"');
    });

    it('refuses bad specifiers', () => {
      syntaxError('a 1.0', 'expected a version operator');
      syntaxError('a !1', 'expected a version operator');
      syntaxError('a >=1,', 'expected a version operator');
      syntaxError('a >=1,,<2', 'expected a version operator');
      syntaxError('a (', 'expected a version operator');
      syntaxError('a ()', 'expected a version operator');
      syntaxError('a (>=1,)', 'expected a version operator');
      syntaxError('a >=', 'expected a version after ">="');
      syntaxError('a >= ,', 'expected a version after ">="');
      syntaxError('a >= ;os_name == "nt"', 'expected a version after ">="');
      syntaxError('a > =1', 'expected a version after ">"');
      syntaxError('a (>=1', 'expected "," or ")" after the version');
      syntaxError('a (>=1 <2)', 'expected "," or ")" after the version');
      syntaxError('a >=1 <2', 'unexpected "<2"');
      syntaxError('a >=1)', 'unexpected ")"');
    });

    it('refuses a bad marker', () => {
      syntaxError('a;', 'empty marker after ";"');
      syntaxError('a ;   ', 'empty marker after ";"');
      syntaxError('a >=1 ; os_name == "nt', 'unbalanced quote in the marker');
      syntaxError("a ; os_name == 'nt", 'unbalanced quote in the marker');
      syntaxError('a ; (os_name == "nt"', 'unbalanced "(" in the marker');
      syntaxError('a ; os_name == "nt")', 'unbalanced ")" in the marker');
      syntaxError('a ; ) (', 'unbalanced ")" in the marker');
    });
  });

  // Vectors checked against `packaging.requirements.Requirement` (packaging 25.0): for each text, the
  // name, the extras, the specifier clauses, the URL and the presence of a marker are those Python reads.
  describe('vectors checked against the Python packaging library', () => {
    const accepted: [string, Pep508Dependency][] = [
      ['FimHUkV.K(  >5.5)', { name: 'FimHUkV.K', extras: [], specifiers: [{ operator: '>', version: '5.5' }] }],
      ['tIzgNIk6 [  ] !=  9.2.*,  <=  10.1.dev4,  ===  foo-bar', { name: 'tIzgNIk6', extras: [], specifiers: [{ operator: '!=', version: '9.2.*' }, { operator: '<=', version: '10.1.dev4' }, { operator: '===', version: 'foo-bar' }] }],
      ['JTUDDJ [  252tHXhuJ];(python_version<"3" or os_name=="posix") and extra == "~=x"', { name: 'JTUDDJ', extras: ['252tHXhuJ'], specifiers: [], marker: '(python_version<"3" or os_name=="posix") and extra == "~=x"' }],
      ['s.bO2jg[M5cF,ntwv,LAQ35Q6]===foo-bar ;python_version < "2.7"', { name: 's.bO2jg', extras: ['M5cF', 'ntwv', 'LAQ35Q6'], specifiers: [{ operator: '===', version: 'foo-bar' }], marker: 'python_version < "2.7"' }],
      ['xeQiwI[0HQ9W5AU5u,  D.dfb5VxQ ]@ file:///tmp/x.tar.gz', { name: 'xeQiwI', extras: ['0HQ9W5AU5u', 'D.dfb5VxQ'], specifiers: [], url: 'file:///tmp/x.tar.gz' }],
      ['9FjPLg_J [ 3X6RS, I.YF3NJsnb  ]    <= 18.12,  ==14', { name: '9FjPLg_J', extras: ['3X6RS', 'I.YF3NJsnb'], specifiers: [{ operator: '<=', version: '18.12' }, { operator: '==', version: '14' }] }],
      ["r8xR1s  [ h5shBrwOS  ]    ===  foo-bar,>=1.15.9.dev4,==2.0.post1; os_name == 'nt'", { name: 'r8xR1s', extras: ['h5shBrwOS'], specifiers: [{ operator: '===', version: 'foo-bar' }, { operator: '>=', version: '1.15.9.dev4' }, { operator: '==', version: '2.0.post1' }], marker: "os_name == 'nt'" }],
      ['cXoXiIK-u [mbBUSbXyCO ]~= 0.0', { name: 'cXoXiIK-u', extras: ['mbBUSbXyCO'], specifiers: [{ operator: '~=', version: '0.0' }] }],
      ['oCj3SlpDZ  @  file:///tmp/x.tar.gz', { name: 'oCj3SlpDZ', extras: [], specifiers: [], url: 'file:///tmp/x.tar.gz' }],
      ['5skB ==5.2,  >  14.5', { name: '5skB', extras: [], specifiers: [{ operator: '==', version: '5.2' }, { operator: '>', version: '14.5' }] }],
      ['Eo    != 15.19.0rc', { name: 'Eo', extras: [], specifiers: [{ operator: '!=', version: '15.19.0rc' }] }],
      ['n6NU  (   ~=7.2.8,  !=8)', { name: 'n6NU', extras: [], specifiers: [{ operator: '~=', version: '7.2.8' }, { operator: '!=', version: '8' }] }],
      ['Aj8aL  [  26Ygiz,WP-bwN]', { name: 'Aj8aL', extras: ['26Ygiz', 'WP-bwN'], specifiers: [] }],
      ["b1c1s7v[  fz ];os_name == 'nt'", { name: 'b1c1s7v', extras: ['fz'], specifiers: [], marker: "os_name == 'nt'" }],
      ['ZC', { name: 'ZC', extras: [], specifiers: [] }],
      ['gW7Zo6v65J[ bNASew9e,  vp]==  3 ;platform_machine != "x86_64"', { name: 'gW7Zo6v65J', extras: ['bNASew9e', 'vp'], specifiers: [{ operator: '==', version: '3' }], marker: 'platform_machine != "x86_64"' }],
      ['39sPN!=15rc1;python_version < "2.7"', { name: '39sPN', extras: [], specifiers: [{ operator: '!=', version: '15rc1' }], marker: 'python_version < "2.7"' }],
      ['8h  ; python_version < "2.7"', { name: '8h', extras: [], specifiers: [], marker: 'python_version < "2.7"' }],
      ['jaAn3j >16,    !=5.3.*,   ==  3.13', { name: 'jaAn3j', extras: [], specifiers: [{ operator: '>', version: '16' }, { operator: '!=', version: '5.3.*' }, { operator: '==', version: '3.13' }] }],
      ['DQX2KmX [bgARAtzW89,EM]@ file:///tmp/x.tar.gz ; platform_machine != "x@ 86_64"', { name: 'DQX2KmX', extras: ['bgARAtzW89', 'EM'], specifiers: [], url: 'file:///tmp/x.tar.gz', marker: 'platform_machine != "x@ 86_64"' }],
      ['rNhVVRO_NL[ p9iHQ,  hLce8aFgb ]( <12,   ~=  15.20.17,    >2.18)', { name: 'rNhVVRO_NL', extras: ['p9iHQ', 'hLce8aFgb'], specifiers: [{ operator: '<', version: '12' }, { operator: '~=', version: '15.20.17' }, { operator: '>', version: '2.18' }] }],
      ['w7gHoHQ @ https://example.com/a.whl ;(python_version<"3" or os_name=="posix") and extra == "x"', { name: 'w7gHoHQ', extras: [], specifiers: [], url: 'https://example.com/a.whl', marker: '(python_version<"3" or os_name=="posix") and extra == "x"' }],
      ['L.MnRtv[ ](<=14 ); sys_platform == "win32" and python_version >= "3.8"', { name: 'L.MnRtv', extras: [], specifiers: [{ operator: '<=', version: '14' }], marker: 'sys_platform == "win32" and python_version >= "3.8"' }],
      ['pDtRV  >15,   ~=11.5,   <=2.11.4a2 ;  sys_platform == "win32" and python_version >= "3.8"', { name: 'pDtRV', extras: [], specifiers: [{ operator: '>', version: '15' }, { operator: '~=', version: '11.5' }, { operator: '<=', version: '2.11.4a2' }], marker: 'sys_platform == "win32" and python_version >= "3.8"' }],
      ['2XccmqKB06  [    ]> 7.3.9,==  0.0.*,  >1.0 ;platform_machine != "x86_64"', { name: '2XccmqKB06', extras: [], specifiers: [{ operator: '>', version: '7.3.9' }, { operator: '==', version: '0.0.*' }, { operator: '>', version: '1.0' }], marker: 'platform_machine != "x86_64"' }],
      ['HXCLoy (  <=  2.15,  ~=11.20.12,<= 14 );platform_machine != "x86_64"', { name: 'HXCLoy', extras: [], specifiers: [{ operator: '<=', version: '2.15' }, { operator: '~=', version: '11.20.12' }, { operator: '<=', version: '14' }], marker: 'platform_machine != "x86_64"' }],
      ['YwjA6r >=17.7,>=  20.12.9, >=10.16.17', { name: 'YwjA6r', extras: [], specifiers: [{ operator: '>=', version: '17.7' }, { operator: '>=', version: '20.12.9' }, { operator: '>=', version: '10.16.17' }] }],
      ['CoTOJKz @ file:///tmp/x.tar.gz ;python_version < "2.7"', { name: 'CoTOJKz', extras: [], specifiers: [], url: 'file:///tmp/x.tar.gz', marker: 'python_version < "2.7"' }],
      ['gtTf7NFsxg  [ ]<8.10,!=  8.20  ;platform_machine != "x86_64"', { name: 'gtTf7NFsxg', extras: [], specifiers: [{ operator: '<', version: '8.10' }, { operator: '!=', version: '8.20' }], marker: 'platform_machine != "x86_64"' }],
    ];

    it.each(accepted)('reads %j as Python does', (text, expected) => {
      expect(one(text)).toEqual(expected);
    });

    // Python rejects these too.
    const rejected = [
      'MCMV  [ >=  15,  ==  19.15.15',
      "FgRmkoq-m6'@  file:///tmp/x.tar.gz",
      'yS   <7.12, ~>=3.7',
      'qd1QYXwUs7   >=0.6, ~=14.0,  <@ 3a2',
      'ms== 0,  [===1.0, >= 14.13.1a2',
      ';up-D7o@ file:///tmp/x.tar.gz',
      '6ZV4[09TYTM,uFG]bQ,fZEX8k] >=2.7.dev4',
      'NOu11E,N',
      'Z28,,UJN== 4',
      'Im3YHPyH   == 10.3a2,  ~= 9.5@ .20',
      'fOyHpb6iGj~=[D3pT  ]',
      'YgF.h9K (  <=3,  !=20.18,[  >=  13.17.10  )',
      'ZnAqKB)P[6PgwB17,  E6VR9jTQ] @ file:///tmp/x.tar.gz',
      'PJX4 [ pdq5U1hy  ',
    ];

    it.each(rejected)('refuses %j as Python does', (text) => {
      expect(() => parseDependencies(text)).toThrow(SyntaxError);
    });
  });
});

describe('stringifyDependencies — pep508', () => {
  it('writes the canonical form, one requirement per line', () => {
    expect(
      stringifyDependencies([
        [{ name: 'requests', extras: ['security', 'tests'], specifiers: [{ operator: '>=', version: '2.8.1' }, { operator: '==', version: '2.8.*' }], marker: 'python_version < "2.7"' }],
        [{ name: 'numpy', extras: [], specifiers: [{ operator: '>=', version: '1.20' }, { operator: '<', version: '2.0' }] }],
        [{ name: 'six', extras: [], specifiers: [] }],
        [{ name: 'tomli', extras: [], specifiers: [], marker: 'python_version < "3.11"' }],
      ]),
    ).toBe(
      [
        'requests[security,tests]>=2.8.1,==2.8.*; python_version < "2.7"',
        'numpy>=1.20,<2.0',
        'six',
        'tomli; python_version < "3.11"',
      ].join('\n'),
    );
  });

  it('writes a URL requirement with whitespace before the marker', () => {
    expect(stringifyDependencies([[{ name: 'pkg', extras: ['x', 'y'], specifiers: [], url: 'https://example.com/pkg.whl' }]])).toBe(
      'pkg[x,y] @ https://example.com/pkg.whl',
    );
    expect(
      stringifyDependencies([[{ name: 'pkg', extras: [], specifiers: [], url: 'https://example.com/pkg.whl', marker: 'os_name == "nt"' }]]),
    ).toBe('pkg @ https://example.com/pkg.whl ; os_name == "nt"');
  });

  it('writes nothing for an empty list and skips an empty group', () => {
    expect(stringifyDependencies([])).toBe('');
    expect(stringifyDependencies([[], [{ name: 'a', extras: [], specifiers: [] }], []])).toBe('a');
  });

  it('refuses a group with several alternatives', () => {
    const alternative = { name: 'a', extras: [], specifiers: [] };
    expect(() => stringifyDependencies([[alternative, alternative]])).toThrow(RangeError);
    expect(() => stringifyDependencies([[alternative, alternative]])).toThrow('a PEP 508 requirement has no alternatives, got 2');
  });

  it('refuses a URL requirement that also has specifiers', () => {
    const mixed = { name: 'a', extras: [], specifiers: [{ operator: '>=' as const, version: '1' }], url: 'https://x.org/a.whl' };
    expect(() => stringifyDependencies([[mixed]])).toThrow(RangeError);
    expect(() => stringifyDependencies([[mixed]])).toThrow('"a" has both a URL and version specifiers');
  });

  it('round-trips through parseDependencies', () => {
    const groups: DependencyGroup<Pep508Dependency>[] = [
      [{ name: 'requests', extras: ['security', 'socks'], specifiers: [{ operator: '~=', version: '2.8' }, { operator: '!=', version: '2.8.3' }], marker: 'python_version >= "3.8" and (os_name == "nt" or extra == "x")' }],
      [{ name: 'pkg', extras: [], specifiers: [], url: 'https://example.com/pkg.whl#sha256=abc', marker: 'sys_platform == "linux"' }],
      [{ name: 'bare', extras: [], specifiers: [] }],
    ];
    expect(parseDependencies(stringifyDependencies(groups))).toEqual(groups);
  });
});
