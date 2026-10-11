/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isIJson } from './isIJson';
import { isJSON } from './isJSON';

describe('isIJson — property-based', () => {
  it('only accepts strict JSON', () => {
    fc.assert(fc.property(fc.string(), (text) => {
      if (isIJson(text)) expect(isJSON(text)).toBe(true);
    }));
  });

  it('accepts the JSON of any value built from safe integers, booleans, null and plain strings', () => {
    const safe = fc.letrec((tie) => ({
      value: fc.oneof(
        { depthSize: 'small' },
        fc.integer(),
        fc.boolean(),
        fc.constant(null),
        fc.string({ unit: 'grapheme-ascii' }),
        fc.array(tie('value')),
        fc.dictionary(fc.string({ unit: 'grapheme-ascii' }), tie('value')),
      ),
    })).value;
    fc.assert(fc.property(safe, (value) => {
      expect(isIJson(JSON.stringify(value))).toBe(true);
    }));
  });
});
