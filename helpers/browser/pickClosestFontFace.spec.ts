/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import type { FontFaceDescriptor } from './pickClosestFontFace';
import { pickClosestFontFace } from './pickClosestFontFace';

const face = fc.record(
  {
    weight: fc.integer({ min: 1, max: 1000 }),
    style: fc.constantFrom('normal', 'italic', 'oblique'),
    stretch: fc.integer({ min: 50, max: 200 }),
  },
  { requiredKeys: [] },
);

describe('pickClosestFontFace — property-based', () => {
  it('always returns one of the faces, for any non-empty list', () => {
    fc.assert(
      fc.property(fc.array(face, { minLength: 1 }), face, (faces, wanted) => {
        expect(faces).toContain(pickClosestFontFace(faces as FontFaceDescriptor[], wanted));
      }),
    );
  });

  it('returns an exact match when there is one', () => {
    fc.assert(
      fc.property(fc.array(face, { minLength: 1 }), fc.nat(), (faces, at) => {
        const target = faces[at % faces.length]!;
        const picked = pickClosestFontFace(faces, target)!;
        expect(picked.weight ?? 400).toBe(target.weight ?? 400);
        expect(picked.style ?? 'normal').toBe(target.style ?? 'normal');
        expect(picked.stretch ?? 100).toBe(target.stretch ?? 100);
      }),
    );
  });

  it('does not depend on the order of the faces for a distinct set', () => {
    fc.assert(
      fc.property(fc.uniqueArray(fc.integer({ min: 1, max: 1000 }), { minLength: 1 }), fc.integer({ min: 1, max: 1000 }), (list, weight) => {
        const faces = list.map((w) => ({ weight: w }));
        expect(pickClosestFontFace(faces, { weight })).toEqual(pickClosestFontFace(faces.toReversed(), { weight }));
      }),
    );
  });
});
