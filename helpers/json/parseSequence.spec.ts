/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { parseSequence } from './parseSequence';
import { stringifySequence } from './stringifySequence';

const normalized = (value: unknown): unknown => JSON.parse(JSON.stringify(value));

describe('parseSequence — property-based', () => {
  it('reads back what stringifySequence writes', () => {
    fc.assert(fc.property(fc.array(fc.jsonValue()), (values) => {
      expect(parseSequence(stringifySequence(values))).toEqual(normalized(values));
    }));
  });

  it('keeps every intact record when the sequence is cut anywhere, with invalidRecords: "skip"', () => {
    fc.assert(fc.property(fc.array(fc.jsonValue(), { minLength: 1 }), fc.nat(), (values, cut) => {
      const text = stringifySequence(values);
      const truncated = text.slice(0, cut % text.length);
      const intact = parseSequence(truncated, { invalidRecords: 'skip' });
      expect(normalized(values)).toEqual(expect.arrayContaining(intact as unknown[]));
      expect(intact.length).toBeLessThanOrEqual(values.length);
    }));
  });

  it('never throws with invalidRecords: "skip", for any string', () => {
    fc.assert(fc.property(fc.string(), (text) => {
      expect(Array.isArray(parseSequence(text, { invalidRecords: 'skip' }))).toBe(true);
    }));
  });
});
