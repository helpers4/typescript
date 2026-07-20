/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { every } from './every';

describe('every — property-based', () => {
  it('matches Array.from(map.values()).every(...)', () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(fc.string(), fc.integer())), (entries) => {
        const map = new Map(entries);
        expect(every(map, (v) => v > 0)).toBe([...map.values()].every((v) => v > 0));
      }),
    );
  });
});

describe('every — contract', () => {
  it('empty map is vacuously true', () => {
    expect(every(new Map(), () => false)).toBe(true);
  });
});
