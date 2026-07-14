/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { flatten } from './flatten';

const safeKey = fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]*$/);
const leaf = fc.oneof(fc.integer(), fc.string(), fc.boolean());

describe('flatten — property-based', () => {
  it('every value in the result is a leaf value that appears somewhere in the input', () => {
    fc.assert(
      fc.property(fc.dictionary(safeKey, leaf, { minKeys: 1, maxKeys: 4 }), (obj) => {
        const result = flatten(obj);
        expect(Object.values(result).sort()).toEqual(Object.values(obj).sort());
      }),
    );
  });

  it('a two-level nested object produces keys joined by a single dot', () => {
    fc.assert(
      fc.property(safeKey, safeKey, leaf, (outer, inner, value) => {
        const result = flatten({ [outer]: { [inner]: value } });
        expect(result[`${outer}.${inner}`]).toBe(value);
        expect(Object.keys(result)).toEqual([`${outer}.${inner}`]);
      }),
    );
  });
});
