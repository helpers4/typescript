/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isJSON } from './isJSON';
import { isJsonc } from './isJsonc';

describe('isJsonc — property-based', () => {
  it('is true for every string isJSON accepts (JSON is valid JSONC)', () => {
    fc.assert(fc.property(fc.string(), (text) => {
      if (isJSON(text)) expect(isJsonc(text)).toBe(true);
    }));
  });

  it('is true for any JSON value with comments and a trailing comma', () => {
    fc.assert(fc.property(fc.array(fc.jsonValue(), { minLength: 1 }), (values) => {
      expect(isJsonc(`[ /* start */ ${values.map((v) => JSON.stringify(v)).join(', // item\n')}, ]`)).toBe(true);
    }));
  });
});
