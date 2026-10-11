/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { parseStrict } from './parseStrict';

describe('parseStrict — property-based', () => {
  it('agrees with JSON.parse on every JSON text', () => {
    fc.assert(fc.property(fc.jsonValue(), (value) => {
      const text = JSON.stringify(value);
      expect(parseStrict(text)).toEqual(JSON.parse(text));
    }));
  });

  it('either parses or throws a SyntaxError, for any string', () => {
    fc.assert(fc.property(fc.string(), (text) => {
      try {
        parseStrict(text);
      } catch (error) {
        expect(error).toBeInstanceOf(SyntaxError);
      }
    }));
  });
});
