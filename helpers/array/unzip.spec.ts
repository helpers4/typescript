/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { unzip } from './unzip';
import { zip } from './zip';

describe('unzip — property-based', () => {
  it('unzip(zip(a, b)) === [a, b] (roundtrip)', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer(), { minLength: 1 }),
        fc.array(fc.integer(), { minLength: 1 }),
        (a, b) => {
          const min = Math.min(a.length, b.length);
          const zipped = zip(a.slice(0, min), b.slice(0, min));
          const [resA, resB] = unzip(zipped);
          expect(resA).toEqual(a.slice(0, min));
          expect(resB).toEqual(b.slice(0, min));
        }
      )
    );
  });

  it('result arrays all have the same length as the input', () => {
    fc.assert(
      fc.property(
        fc.array(fc.tuple(fc.integer(), fc.string()), { minLength: 1 }),
        (pairs) => {
          const [nums, strs] = unzip(pairs);
          expect(nums).toHaveLength(pairs.length);
          expect(strs).toHaveLength(pairs.length);
        }
      )
    );
  });
});
