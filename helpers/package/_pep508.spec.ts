/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { parseDependencies as parseAny } from './parseDependencies';
import { stringifyDependencies as stringifyAny } from './stringifyDependencies';
import type { DependencyGroup, Pep508Dependency, Pep508Operator } from './types';

const parseDependencies = (field: string) => parseAny(field, 'pep508');
const stringifyDependencies = (groups: readonly DependencyGroup<Pep508Dependency>[]) => stringifyAny(groups, 'pep508');

const operators: Pep508Operator[] = ['~=', '==', '!=', '<=', '>=', '<', '>', '==='];
const identifier = fc.stringMatching(/^[A-Za-z0-9]([A-Za-z0-9._-]{0,8}[A-Za-z0-9])?$/);

const clause = fc.record({
  operator: fc.constantFrom(...operators),
  version: fc.stringMatching(/^[0-9][A-Za-z0-9.+!-]{0,8}$/),
});

const marker = fc.constantFrom(
  'python_version < "3.9"',
  "os_name == 'nt'",
  'sys_platform == "win32" and (python_version >= "3.8" or extra == "x")',
);

const requirement = fc.oneof(
  fc.record(
    {
      name: identifier,
      extras: fc.array(identifier, { maxLength: 3 }),
      specifiers: fc.array(clause, { maxLength: 3 }),
      marker,
    },
    { requiredKeys: ['name', 'extras', 'specifiers'] },
  ),
  fc.record(
    {
      name: identifier,
      extras: fc.array(identifier, { maxLength: 3 }),
      specifiers: fc.constant([]),
      url: fc.stringMatching(/^[a-z]{2,6}:\/\/[a-z0-9./#=_-]{1,20}$/),
      marker,
    },
    { requiredKeys: ['name', 'extras', 'specifiers', 'url'] },
  ),
) as fc.Arbitrary<Pep508Dependency>;

const groups = fc.array(fc.array(requirement, { minLength: 1, maxLength: 1 }), { maxLength: 5 });

describe('pep508 dependencies — property-based', () => {
  it('round-trips through stringifyDependencies', () => {
    fc.assert(fc.property(groups, (value) => {
      expect(parseDependencies(stringifyDependencies(value))).toEqual(value);
    }));
  });

  it('stringify is stable once normalised', () => {
    fc.assert(fc.property(groups, (value) => {
      const text = stringifyDependencies(value);
      expect(stringifyDependencies(parseDependencies(text))).toBe(text);
    }));
  });

  it('is not affected by whitespace around the extras, the operators and the commas', () => {
    fc.assert(fc.property(requirement, fc.constantFrom(' ', '  ', '\t'), (value, space) => {
      fc.pre(value.url === undefined);
      const spaced =
        value.name +
        (value.extras.length > 0 ? `${space}[${space}${value.extras.join(`${space},${space}`)}${space}]` : '') +
        space +
        value.specifiers.map((entry) => `${entry.operator}${space}${entry.version}`).join(`${space},${space}`) +
        (value.marker === undefined ? '' : `${space};${space}${value.marker}`);
      expect(parseDependencies(spaced)).toEqual([[value]]);
    }));
  });

  it('is not affected by comments, blank lines and continuations', () => {
    fc.assert(fc.property(groups, (value) => {
      const noisy = stringifyDependencies(value)
        .split('\n')
        .map((line) => `# header\n\n${line} # trailing comment\n`)
        .join('');
      expect(parseDependencies(noisy)).toEqual(value);
    }));
  });

  it('throws only a SyntaxError on arbitrary text', () => {
    fc.assert(fc.property(fc.string(), (text) => {
      try {
        parseDependencies(text);
      } catch (error) {
        expect(error).toBeInstanceOf(SyntaxError);
      }
    }));
    fc.assert(fc.property(fc.stringMatching(/^[a-z0-9[\]()<>=!~,;@#"' \\\n.*-]{0,60}$/), (text) => {
      try {
        parseDependencies(text);
      } catch (error) {
        expect(error).toBeInstanceOf(SyntaxError);
      }
    }), { numRuns: 500 });
  });

  it('yields one group of exactly one requirement per accepted line', () => {
    fc.assert(fc.property(fc.stringMatching(/^[a-z0-9[\]()<>=!~,;@ \n.*-]{0,60}$/), (text) => {
      let result: DependencyGroup<Pep508Dependency>[] = [];
      try {
        result = parseDependencies(text);
      } catch {
        return;
      }
      for (const group of result) expect(group).toHaveLength(1);
    }), { numRuns: 500 });
  });
});

describe('pep508 dependencies — adversarial input', () => {
  const size = 50_000;
  const timed = (text: string): void => {
    const start = performance.now();
    try {
      parseDependencies(text);
    } catch (error) {
      expect(error).toBeInstanceOf(SyntaxError);
    }
    expect(performance.now() - start).toBeLessThan(1000);
  };

  it.each([
    ['a long name', 'a' + '-'.repeat(size) + '!'],
    ['alternating name characters', 'a-'.repeat(size / 2)],
    ['a long run of whitespace', 'a' + ' '.repeat(size) + '!'],
    ['whitespace before a comment', 'a' + ' '.repeat(size)],
    ['many extras', 'a[' + 'x,'.repeat(size / 2)],
    ['many specifiers', 'a ' + '>=1,'.repeat(size / 4)],
    ['nested parentheses', 'a (' + '('.repeat(size)],
    ['an unterminated marker quote', 'a ; ' + '"'.repeat(size) + '\'' ],
    ['many open marker parentheses', 'a ; ' + '('.repeat(size)],
    ['many continuation lines', 'a \\\n'.repeat(size / 4)],
    ['many lines', 'a\n'.repeat(size / 2)],
    ['many hash signs', 'a ' + '# '.repeat(size / 2)],
    ['a long version', 'a >=' + '1.'.repeat(size / 2)],
    ['a long URL', 'a @ ' + 'u'.repeat(size) + ' ;'],
  ])('stays linear on %s', (_label, text) => {
    timed(text);
  });
});
