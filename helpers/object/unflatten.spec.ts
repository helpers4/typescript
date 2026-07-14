/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { flatten } from './flatten';
import { unflatten } from './unflatten';

const safeKey = fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]*$/);
const leaf = fc.oneof(fc.integer(), fc.string(), fc.boolean());

describe('unflatten — property-based', () => {
  it('flatten and unflatten round-trip any plain-object structure without dotted key names', () => {
    fc.assert(
      fc.property(
        fc.dictionary(safeKey, fc.dictionary(safeKey, leaf, { minKeys: 1, maxKeys: 3 }), { minKeys: 1, maxKeys: 3 }),
        (nested) => {
          expect(unflatten(flatten(nested))).toEqual(nested);
        },
      ),
    );
  });

  it('a single dotted key always produces a two-level object', () => {
    fc.assert(
      fc.property(safeKey, safeKey, leaf, (outer, inner, value) => {
        const result = unflatten({ [`${outer}.${inner}`]: value });
        expect((result[outer] as Record<string, unknown>)[inner]).toBe(value);
      }),
    );
  });
});
