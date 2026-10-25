/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { parseRpm, stringifyRpm } from './_rpm';
import type { ComparisonOperator, DependencyGroup, RpmDependency } from './types';

const operators: ComparisonOperator[] = ['<', '<=', '=', '>=', '>'];

const name = fc.oneof(
  fc.stringMatching(/^[a-z0-9_][a-z0-9_+.~-]{0,10}$/),
  fc.stringMatching(/^\/[a-z0-9_.+/-]{1,10}$/),
  fc
    .tuple(fc.stringMatching(/^[a-z][a-z0-9_+-]{0,6}$/), fc.stringMatching(/^[A-Za-z0-9:._=<>+-]{0,8}$/))
    .map(([base, inner]) => `${base}(${inner})`),
  fc.stringMatching(/^[a-z][a-z0-9.]{0,6}$/).map((base) => `${base}()(64bit)`),
);

const dependency: fc.Arbitrary<RpmDependency> = fc.record(
  {
    name,
    version: fc.record({
      operator: fc.constantFrom(...operators),
      version: fc.stringMatching(/^([0-9]:)?[0-9][A-Za-z0-9.+~^_-]{0,8}$/),
    }),
  },
  { requiredKeys: ['name'] },
);

const groups: fc.Arbitrary<DependencyGroup<RpmDependency>[]> = fc.array(
  fc.array(dependency, { minLength: 1, maxLength: 3 }),
  { maxLength: 4 },
);

describe('rpm dependencies — property-based', () => {
  it('round-trips through stringifyRpm', () => {
    fc.assert(fc.property(groups, (value) => {
      expect(parseRpm(stringifyRpm(value))).toEqual(value);
    }));
  });

  it('stringify is stable once normalised', () => {
    fc.assert(fc.property(groups, (value) => {
      const text = stringifyRpm(value);
      expect(stringifyRpm(parseRpm(text))).toBe(text);
    }));
  });

  it('is not affected by other whitespace or separators between entries', () => {
    fc.assert(fc.property(groups, fc.constantFrom(' ', '  ', '\n', '\t', ' , '), (value, separator) => {
      const spaced = stringifyRpm(value).replaceAll(', ', separator);
      expect(parseRpm(spaced)).toEqual(value);
    }));
  });

  it('throws only a SyntaxError on arbitrary text', () => {
    fc.assert(fc.property(fc.string(), (text) => {
      try {
        parseRpm(text);
      } catch (error) {
        expect(error).toBeInstanceOf(SyntaxError);
      }
    }));
  });

  it('throws only a SyntaxError on text built from the syntax tokens', () => {
    const token = fc.constantFrom('(', ')', ' ', ',', 'or', 'and', '>=', '=', '1.0', 'a', 'perl(x)', '\n');
    fc.assert(fc.property(fc.array(token, { maxLength: 30 }), (tokens) => {
      try {
        parseRpm(tokens.join(''));
      } catch (error) {
        expect(error).toBeInstanceOf(SyntaxError);
      }
    }));
  });

  it('stays fast on adversarial input of 50k characters', () => {
    const unit = fc.constantFrom('(', ')', 'a', ' ', ',', '>=', 'or ', '(a or ', 'a(', '(a or (');
    fc.assert(fc.property(unit, (piece) => {
      const input = piece.repeat(Math.ceil(50_000 / piece.length)).slice(0, 50_000);
      const started = performance.now();
      try {
        parseRpm(input);
      } catch (error) {
        expect(error).toBeInstanceOf(SyntaxError);
      }
      expect(performance.now() - started).toBeLessThan(500);
    }), { numRuns: 20 });
  });
});
