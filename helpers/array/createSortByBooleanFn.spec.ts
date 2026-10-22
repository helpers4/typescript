/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { createSortByBooleanFn } from './createSortByBooleanFn';

describe('createSortByBooleanFn — property-based', () => {
  it('all true-valued items precede all false-valued items when trueFirst', () => {
    fc.assert(
      fc.property(fc.array(fc.record({ flag: fc.boolean() })), (items) => {
        const sorted = [...items].sort(createSortByBooleanFn('flag'));
        const firstFalseIndex = sorted.findIndex((i) => !i.flag);
        if (firstFalseIndex === -1) return;
        expect(sorted.slice(firstFalseIndex).every((i) => !i.flag)).toBe(true);
      }),
    );
  });

  it('all false-valued items precede all true-valued items when trueFirst is false', () => {
    fc.assert(
      fc.property(fc.array(fc.record({ flag: fc.boolean() })), (items) => {
        const sorted = [...items].sort(createSortByBooleanFn('flag', false));
        const firstTrueIndex = sorted.findIndex((i) => i.flag);
        if (firstTrueIndex === -1) return;
        expect(sorted.slice(firstTrueIndex).every((i) => i.flag)).toBe(true);
      }),
    );
  });

  it('preserves array length', () => {
    fc.assert(
      fc.property(fc.array(fc.record({ flag: fc.boolean() })), (items) => {
        expect([...items].sort(createSortByBooleanFn('flag'))).toHaveLength(items.length);
      }),
    );
  });
});
