/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import JSON5 from 'json5';
import { describe, expect, it } from 'vitest';
import { readJson } from '../_shared/_jsonReader';
import { isJson5 } from './isJson5';

describe('isJson5', () => {
  it.each(["{ name: 'app', retries: 0x3, }", '{"a":1}', '{"a":1, // c\n}', 'NaN', "'s'"])('is true for %j', (value) => {
    expect(isJson5(value)).toBe(true);
  });

  it.each(['{ my-key: 1 }', '[1,,]', '01', 'undefined', ''])('is false for %j', (value) => {
    expect(isJson5(value)).toBe(false);
  });

  it.each([42, null, undefined, {}])('is false for the non-string %j', (value) => {
    expect(isJson5(value)).toBe(false);
  });

  // The native-parser fast path must never change an answer, only who does the work.
  it('agrees with always handing the text to the reader', () => {
    const reads = (text: string): boolean => {
      try {
        readJson(text, { dialect: 'json5' });
        return true;
      } catch {
        return false;
      }
    };
    fc.assert(
      fc.property(fc.string({ maxLength: 24 }), (text) => {
        expect(isJson5(text)).toBe(reads(text));
      }),
      { numRuns: 5000 },
    );
  });

  it('agrees with the reference json5 package on generated JSON5', () => {
    fc.assert(
      fc.property(fc.jsonValue(), fc.constantFrom(0, 2), fc.constantFrom('"', "'"), (value, space, quote) => {
        const text = JSON5.stringify(value, { space, quote });
        expect(isJson5(text)).toBe(true);
      }),
    );
  });
});
