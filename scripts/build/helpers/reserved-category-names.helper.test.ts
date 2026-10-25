/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { RESERVED_CATEGORY_NAMES, assertNoReservedCategoryName } from './reserved-category-names.helper';

describe('assertNoReservedCategoryName', () => {
  it('reserves the bundle, unified and presets package names', () => {
    expect(RESERVED_CATEGORY_NAMES).toEqual(['all', 'helpers4', 'presets']);
  });

  it('accepts ordinary category names', () => {
    expect(() => assertNoReservedCategoryName(['array', 'string', 'preset', 'config'])).not.toThrow();
  });

  it('names every clashing category', () => {
    expect(() => assertNoReservedCategoryName(['array', 'presets', 'all'])).toThrow('helpers/presets, helpers/all: reserved name');
  });
});
