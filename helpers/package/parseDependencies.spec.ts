/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import type { Dependency, DependencyOperator } from './parseDependencies';
import { parseDependencies } from './parseDependencies';
import { stringifyDependencies } from './stringifyDependencies';

const operators: DependencyOperator[] = ['<<', '<=', '=', '>=', '>>'];

const relationship: fc.Arbitrary<Dependency> = fc
  .record(
    {
      name: fc.stringMatching(/^[a-z0-9][a-z0-9+.-]{0,10}$/),
      arch: fc.stringMatching(/^[a-z0-9][a-z0-9-]{0,6}$/),
      version: fc.record({
        operator: fc.constantFrom(...operators),
        version: fc.stringMatching(/^([0-9]:)?[0-9][A-Za-z0-9.+~-]{0,8}$/),
      }),
      architectures: fc.array(fc.stringMatching(/^!?[a-z0-9][a-z0-9-]{0,6}$/), { minLength: 1, maxLength: 3 }),
      profiles: fc.array(
        fc.array(fc.stringMatching(/^!?[a-z0-9][a-z0-9.]{0,6}$/), { minLength: 1, maxLength: 3 }),
        { minLength: 1, maxLength: 2 },
      ),
    },
    { requiredKeys: ['name'] },
  );

const groups = fc.array(fc.array(relationship, { minLength: 1, maxLength: 3 }), { maxLength: 4 });

describe('parseDependencies — property-based', () => {
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

  it('is not affected by extra whitespace between the tokens', () => {
    fc.assert(fc.property(groups, fc.constantFrom(' ', '  ', '\n ', '\t'), (value, space) => {
      const spaced = stringifyDependencies(value).replaceAll(', ', `${space},${space}`).replaceAll(' | ', `${space}|${space}`);
      expect(parseDependencies(spaced)).toEqual(value);
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
});
