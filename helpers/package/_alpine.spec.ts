/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { parseDependencies as parseAny } from './parseDependencies';
import { stringifyDependencies as stringifyAny } from './stringifyDependencies';
import type { AlpineDependency, DependencyGroup } from './types';

const parseDependencies = (field: string) => parseAny(field, 'alpine');
const stringifyDependencies = (groups: readonly DependencyGroup<AlpineDependency>[]) => stringifyAny(groups, 'alpine');

// The operators apk writes; `AlpineOperator` must list all of them for this to type-check.
const operators = ['<', '<=', '=', '>=', '>', '~', '<~', '>~', '><'] as const;

const dependency: fc.Arbitrary<AlpineDependency> = fc.record(
  {
    name: fc.stringMatching(/^[A-Za-z0-9_+.:/@-]{1,12}$/),
    version: fc.record({
      operator: fc.constantFrom(...operators),
      version: fc.stringMatching(/^[A-Za-z0-9][A-Za-z0-9._+/=~-]{0,10}$/),
    }),
    conflict: fc.constant(true as const),
  },
  { requiredKeys: ['name'] },
);

const groups = fc.array(fc.array(dependency, { minLength: 1, maxLength: 1 }), { maxLength: 6 });

describe('alpine dependencies — property-based', () => {
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

  it('is not affected by the whitespace between entries', () => {
    fc.assert(fc.property(groups, fc.constantFrom('  ', '\n', '\t', ' \n '), (value, space) => {
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

  it('throws only a SyntaxError on text built from the format characters', () => {
    fc.assert(fc.property(fc.stringMatching(/^[a-z0-9!<>=~ \n:'"]{0,40}$/), (text) => {
      try {
        parseDependencies(text);
      } catch (error) {
        expect(error).toBeInstanceOf(SyntaxError);
      }
    }));
  });

  it('stays linear on adversarial text', () => {
    fc.assert(fc.property(fc.constantFrom('a>', '!', ' ', 'a>=1<', '~=', 'a '), (unit) => {
      const start = Date.now();
      try {
        parseDependencies(`${unit.repeat(Math.ceil(50_000 / unit.length))}"`);
      } catch (error) {
        expect(error).toBeInstanceOf(SyntaxError);
      }
      expect(Date.now() - start).toBeLessThan(2000);
    }), { numRuns: 12 });
  });
});
