/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { parseDependencies as parseAny } from './parseDependencies';
import { stringifyDependencies as stringifyAny } from './stringifyDependencies';
import type { ArchDependency, ComparisonOperator, DependencyGroup } from './types';

const parseDependencies = (field: string) => parseAny(field, 'arch');
const stringifyDependencies = (groups: readonly DependencyGroup<ArchDependency>[]) => stringifyAny(groups, 'arch');

const operators: ComparisonOperator[] = ['<', '<=', '=', '>=', '>'];

const dependency: fc.Arbitrary<ArchDependency> = fc.record(
  {
    name: fc.stringMatching(/^[a-z0-9@_+][a-z0-9@._+-]{0,10}$/),
    version: fc.record({
      operator: fc.constantFrom(...operators),
      version: fc.stringMatching(/^([0-9]:)?[0-9][A-Za-z0-9._+~-]{0,8}$/),
    }),
  },
  { requiredKeys: ['name'] },
);

const groups = fc.array(dependency.map((entry): DependencyGroup<ArchDependency> => [entry]), { maxLength: 6 });

describe('arch dependencies — property-based', () => {
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

  it('reads the PKGBUILD array spelling of the same entries', () => {
    fc.assert(fc.property(groups, fc.constantFrom("'", '"'), fc.constantFrom(' ', '\n  ', ' # note\n'), (value, quote, separator) => {
      const entries = stringifyDependencies(value).split(' ').filter((entry) => entry !== '');
      const array = `(${entries.map((entry) => `${quote}${entry}${quote}`).join(separator)}${separator === ' ' ? '' : '\n'})`;
      expect(parseDependencies(array)).toEqual(value);
    }));
  });

  it('is not affected by extra whitespace between the entries', () => {
    fc.assert(fc.property(groups, fc.constantFrom(' ', '  ', '\n', '\t'), (value, space) => {
      expect(parseDependencies(stringifyDependencies(value).replaceAll(' ', space))).toEqual(value);
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
  });

  it('throws only a SyntaxError on text made of the format characters', () => {
    fc.assert(fc.property(fc.stringMatching(/^[a-z0-9'"()#<>=:\s.-]{0,40}$/), (text) => {
      try {
        parseDependencies(text);
      } catch (error) {
        expect(error).toBeInstanceOf(SyntaxError);
      }
    }));
  });
});

describe('arch dependencies — contract', () => {
  it('parses adversarial input in linear time', () => {
    const unit = fc.constantFrom('a>', "'", '(', ')', '#', '>=', ' ', ':', 'a');
    fc.assert(
      fc.property(unit, (piece) => {
        const text = piece.repeat(Math.ceil(50_000 / piece.length));
        const start = performance.now();
        try {
          parseDependencies(text);
        } catch (error) {
          expect(error).toBeInstanceOf(SyntaxError);
        }
        expect(performance.now() - start).toBeLessThan(1000);
      }),
      { numRuns: 9 },
    );
  });
});
