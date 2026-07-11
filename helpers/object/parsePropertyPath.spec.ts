/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { parsePropertyPath } from './parsePropertyPath';

const safeSegment = fc.stringMatching(/^[a-zA-Z]{1,8}$/);

describe('parsePropertyPath — property-based', () => {
  it('joining segments with "." and re-parsing round-trips back to the same segments', () => {
    fc.assert(
      fc.property(fc.array(safeSegment, { minLength: 1, maxLength: 5 }), (segments) => {
        const path = segments.join('.');
        expect(parsePropertyPath(path)).toEqual(segments);
      }),
    );
  });

  it('always returns a frozen (immutable) array', () => {
    fc.assert(
      fc.property(fc.array(safeSegment, { minLength: 1, maxLength: 5 }), (segments) => {
        const result = parsePropertyPath(segments.join('.'));
        expect(Object.isFrozen(result)).toBe(true);
      }),
    );
  });

  it('calling twice with the same path returns the exact same cached reference', () => {
    fc.assert(
      fc.property(fc.array(safeSegment, { minLength: 1, maxLength: 5 }), (segments) => {
        const path = segments.join('.');
        expect(parsePropertyPath(path)).toBe(parsePropertyPath(path));
      }),
    );
  });

  it('a purely numeric bracket path always yields number segments', () => {
    fc.assert(
      fc.property(fc.array(fc.integer({ min: 0, max: 9999 }), { minLength: 1, maxLength: 5 }), (indices) => {
        const path = indices.map((i) => `[${i}]`).join('');
        expect(parsePropertyPath(path)).toEqual(indices);
      }),
    );
  });
});
