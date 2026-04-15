/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isValidRegex } from './isValidRegex';

describe('isValidRegex', () => {
  it('should validate correct regex patterns', () => {
    expect(isValidRegex('[a-z]+')).toBe(true);
    expect(isValidRegex('\\d{3}')).toBe(true);
    expect(isValidRegex('.*')).toBe(true);
    expect(isValidRegex('^hello$')).toBe(true);
  });

  it('should reject invalid regex patterns', () => {
    expect(isValidRegex('[')).toBe(false);
    expect(isValidRegex('*')).toBe(false);
    expect(isValidRegex('(?')).toBe(false);
  });
});
