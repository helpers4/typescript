/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { zip } from './zip';

describe('zip — property-based', () => {
  it('result length equals min of both array lengths', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer()),
        fc.array(fc.integer()),
        (a, b) => {
          expect(zip(a, b)).toHaveLength(Math.min(a.length, b.length));
        }
      )
    );
  });

  it('first elements of tuples equal first input array', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer()),
        fc.array(fc.integer()),
        (a, b) => {
          const zipped = zip(a, b);
          const min = Math.min(a.length, b.length);
          expect(zipped.map(([x]) => x)).toEqual(a.slice(0, min));
        }
      )
    );
  });
});
