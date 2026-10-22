/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import JSON5 from 'json5';
import { describe, expect, it } from 'vitest';
import { isJSON } from './isJSON';
import { isJson5 } from './isJson5';
import { isJsonc } from './isJsonc';

describe('isJson5 — property-based', () => {
  it('is true for everything isJSON and isJsonc accept (JSON5 is a superset of both)', () => {
    fc.assert(fc.property(fc.string(), (text) => {
      if (isJSON(text) || isJsonc(text)) expect(isJson5(text)).toBe(true);
    }));
  });

  it('is true for anything JSON5.stringify writes', () => {
    fc.assert(fc.property(fc.jsonValue(), (value) => {
      expect(isJson5(JSON5.stringify(value))).toBe(true);
    }));
  });
});
