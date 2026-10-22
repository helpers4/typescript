/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isJSON } from './isJSON';

describe('isJSON', () => {
  it('returns true for a valid JSON object string', () => {
    expect(isJSON('{"a":1}')).toBe(true);
  });

  it('returns true for a valid JSON array string', () => {
    expect(isJSON('[1,2,3]')).toBe(true);
  });

  it('returns true for valid JSON primitives', () => {
    expect(isJSON('42')).toBe(true);
    expect(isJSON('"str"')).toBe(true);
    expect(isJSON('null')).toBe(true);
    expect(isJSON('true')).toBe(true);
  });

  it('returns false for malformed JSON', () => {
    expect(isJSON('{a:1}')).toBe(false);
    expect(isJSON('not json')).toBe(false);
    expect(isJSON('')).toBe(false);
  });

  it('returns false for non-string values', () => {
    expect(isJSON(42)).toBe(false);
    expect(isJSON({ a: 1 })).toBe(false);
    expect(isJSON(null)).toBe(false);
    expect(isJSON(undefined)).toBe(false);
  });
});
