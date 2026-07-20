/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { mapKeys } from './mapKeys';

describe('mapKeys — property-based', () => {
  it('never produces more entries than the input (collisions can only shrink it)', () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(fc.string(), fc.integer())), (entries) => {
        const map = new Map(entries);
        const result = mapKeys(map, (key) => key.length);
        expect(result.size).toBeLessThanOrEqual(map.size);
      }),
    );
  });

  it('identity transform preserves the map', () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(fc.string(), fc.integer())), (entries) => {
        const map = new Map(entries);
        expect(mapKeys(map, (key) => key)).toEqual(map);
      }),
    );
  });
});

describe('mapKeys — contract', () => {
  it('empty map returns an empty map', () => {
    expect(mapKeys(new Map(), (k: string) => k)).toEqual(new Map());
  });
});
