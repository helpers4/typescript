/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isFormData } from './isFormData';

describe('isFormData', () => {
  it('should return true for FormData instances', () => {
    expect(isFormData(new FormData())).toBe(true);

    const fd = new FormData();
    fd.append('key', 'value');
    expect(isFormData(fd)).toBe(true);
  });

  it('should return false for non-FormData values', () => {
    expect(isFormData(null)).toBe(false);
    expect(isFormData(undefined)).toBe(false);
    expect(isFormData('')).toBe(false);
    expect(isFormData(42)).toBe(false);
    expect(isFormData({})).toBe(false);
    expect(isFormData([])).toBe(false);
    expect(isFormData(new Blob())).toBe(false);
    expect(isFormData(new URLSearchParams())).toBe(false);
  });
});
