/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { stripJsonComments } from '../_shared/_stripJsonComments';
import { isJsonc } from './isJsonc';

describe('isJsonc', () => {
  it.each(['{"a":1}', '{"a":1, // c\n}', '[1,/* c */2,]', 'null'])('is true for %j', (value) => {
    expect(isJsonc(value)).toBe(true);
  });

  it('accepts a leading byte order mark', () => {
    expect(isJsonc('\uFEFF{"a":1,}')).toBe(true);
  });

  it.each(["{'a':1}", '{a:1}', '', 'not json'])('is false for %j', (value) => {
    expect(isJsonc(value)).toBe(false);
  });

  it.each([42, null, undefined, {}, ['{}']])('is false for the non-string %j', (value) => {
    expect(isJsonc(value)).toBe(false);
  });

  // The comment/trailing-comma pre-check must never change an answer, only who does the work.
  it('agrees with always stripping comments first', () => {
    const parses = (text: string): boolean => {
      try {
        JSON.parse(stripJsonComments(text));
        return true;
      } catch {
        return false;
      }
    };
    fc.assert(
      fc.property(fc.string({ maxLength: 24 }), (text) => {
        expect(isJsonc(text)).toBe(parses(text));
      }),
      { numRuns: 5000 },
    );
    fc.assert(
      fc.property(fc.jsonValue(), (value) => {
        expect(isJsonc(JSON.stringify(value))).toBe(true);
      }),
    );
  });

  it('accepts a trailing comma that is only whitespace away from a bracket', () => {
    expect(isJsonc('[1, 2 ,\n\t ]')).toBe(true);
    expect(isJsonc('{"a":1\n}\n')).toBe(true);
  });
});
