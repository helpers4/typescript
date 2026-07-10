/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { createSortByBooleanFn } from './createSortByBooleanFn';

describe('createSortByBooleanFn', () => {
  it('sorts true values before false values by default', () => {
    const items = [
      { isDefault: false, label: 'a' },
      { isDefault: true, label: 'b' },
      { isDefault: false, label: 'c' },
    ];
    items.sort(createSortByBooleanFn('isDefault'));
    expect(items.map((i) => i.isDefault)).toEqual([true, false, false]);
  });

  it('sorts false values before true values when trueFirst is false', () => {
    const items = [
      { isDefault: true, label: 'a' },
      { isDefault: false, label: 'b' },
    ];
    items.sort(createSortByBooleanFn('isDefault', false));
    expect(items.map((i) => i.isDefault)).toEqual([false, true]);
  });

  it('treats equal values as a tie', () => {
    const items = [
      { isDefault: true, label: 'a' },
      { isDefault: true, label: 'b' },
    ];
    const fn = createSortByBooleanFn<(typeof items)[number]>('isDefault');
    expect(fn(items[0]!, items[1]!)).toBe(0);
    expect(fn(items[1]!, items[0]!)).toBe(0);
  });

  it('coerces non-boolean values with Boolean()', () => {
    const items = [
      { flag: 0, label: 'a' },
      { flag: 1, label: 'b' },
      { flag: '', label: 'c' },
    ];
    items.sort(createSortByBooleanFn<(typeof items)[number]>('flag'));
    expect(items[0]!.label).toBe('b');
  });
});
