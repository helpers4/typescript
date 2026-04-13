/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { isNotNullish } from './isNotNullish';

describe('isNotNullish', () => {
  it('should return true when value is defined', () => {
    expect(isNotNullish('a string')).toBeTruthy();
    expect(isNotNullish('')).toBeTruthy();
    expect(isNotNullish(0)).toBeTruthy();
    expect(isNotNullish(0.5)).toBeTruthy();
    expect(isNotNullish(true)).toBeTruthy();
    expect(isNotNullish(false)).toBeTruthy();
    expect(isNotNullish({})).toBeTruthy();
  });

  it('should return false when value is undefined or null', () => {
    expect(isNotNullish(undefined)).toBeFalsy();
    expect(isNotNullish(null)).toBeFalsy();
  });
});
