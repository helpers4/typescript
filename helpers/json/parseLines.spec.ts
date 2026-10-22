/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { parseLines } from './parseLines';
import { stringifyLines } from './stringifyLines';

const normalized = (value: unknown): unknown => JSON.parse(JSON.stringify(value));

describe('parseLines — property-based', () => {
  it('reads back what stringifyLines writes', () => {
    fc.assert(fc.property(fc.array(fc.jsonValue()), (values) => {
      expect(parseLines(stringifyLines(values))).toEqual(normalized(values));
    }));
  });

  it('reads CRLF line endings like LF ones', () => {
    fc.assert(fc.property(fc.array(fc.jsonValue()), (values) => {
      const text = stringifyLines(values);
      expect(parseLines(text.replaceAll('\n', '\r\n'))).toEqual(parseLines(text));
    }));
  });

  it('never throws with invalidLines: "skip", for any string', () => {
    fc.assert(fc.property(fc.string(), (text) => {
      expect(Array.isArray(parseLines(text, { invalidLines: 'skip' }))).toBe(true);
    }));
  });
});
