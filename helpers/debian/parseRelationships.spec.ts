/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import type { Relationship, RelationshipOperator } from './parseRelationships';
import { parseRelationships } from './parseRelationships';
import { stringifyRelationships } from './stringifyRelationships';

const operators: RelationshipOperator[] = ['<<', '<=', '=', '>=', '>>', '<', '>'];

const relationship: fc.Arbitrary<Relationship> = fc
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

describe('parseRelationships — property-based', () => {
  it('round-trips through stringifyRelationships', () => {
    fc.assert(fc.property(groups, (value) => {
      expect(parseRelationships(stringifyRelationships(value))).toEqual(value);
    }));
  });

  it('stringify is stable once normalised', () => {
    fc.assert(fc.property(groups, (value) => {
      const text = stringifyRelationships(value);
      expect(stringifyRelationships(parseRelationships(text))).toBe(text);
    }));
  });

  it('is not affected by extra whitespace between the tokens', () => {
    fc.assert(fc.property(groups, fc.constantFrom(' ', '  ', '\n ', '\t'), (value, space) => {
      const spaced = stringifyRelationships(value).replaceAll(', ', `${space},${space}`).replaceAll(' | ', `${space}|${space}`);
      expect(parseRelationships(spaced)).toEqual(value);
    }));
  });

  it('throws only a SyntaxError on arbitrary text', () => {
    fc.assert(fc.property(fc.string(), (text) => {
      try {
        parseRelationships(text);
      } catch (error) {
        expect(error).toBeInstanceOf(SyntaxError);
      }
    }));
  });
});
