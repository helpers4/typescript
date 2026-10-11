/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { parse } from './parse';

describe('parse — property-based', () => {
  it('agrees with JSON.parse on every strict JSON text', () => {
    fc.assert(fc.property(fc.jsonValue(), (value) => {
      const text = JSON.stringify(value, null, 2);
      expect(parse(text)).toEqual(JSON.parse(text));
    }));
  });

  it('ignores a comment added at the end of every line', () => {
    fc.assert(fc.property(fc.jsonValue(), fc.stringMatching(/^[^\r\n]*$/), (value, comment) => {
      const text = JSON.stringify(value, null, 2)
        .split('\n')
        .map((line) => `${line} // ${comment}`)
        .join('\n');
      expect(parse(text)).toEqual(JSON.parse(JSON.stringify(value)));
    }));
  });

  it('either parses or throws a SyntaxError, for any string', () => {
    fc.assert(fc.property(fc.string(), (text) => {
      try {
        parse(text);
      } catch (error) {
        expect(error).toBeInstanceOf(SyntaxError);
      }
    }));
  });
});
