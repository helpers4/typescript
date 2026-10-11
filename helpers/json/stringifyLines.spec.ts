/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { stringifyLines } from './stringifyLines';

describe('stringifyLines — property-based', () => {
  it('writes exactly one line per value', () => {
    fc.assert(fc.property(fc.array(fc.jsonValue()), (values) => {
      const text = stringifyLines(values);
      expect(text.split('\n')).toHaveLength(values.length + 1);
      expect(text === '' || text.endsWith('\n')).toBe(true);
    }));
  });

  it('writes each line as the compact JSON of its value', () => {
    fc.assert(fc.property(fc.array(fc.jsonValue()), (values) => {
      const lines = stringifyLines(values).split('\n').slice(0, -1);
      expect(lines).toEqual(values.map((value) => JSON.stringify(value)));
    }));
  });
});
