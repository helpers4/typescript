/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isJson5 } from './isJson5';

describe('isJson5', () => {
  it.each(["{ name: 'app', retries: 0x3, }", '{"a":1}', '{"a":1, // c\n}', 'NaN', "'s'"])('is true for %j', (value) => {
    expect(isJson5(value)).toBe(true);
  });

  it.each(['{ my-key: 1 }', '[1,,]', '01', 'undefined', ''])('is false for %j', (value) => {
    expect(isJson5(value)).toBe(false);
  });

  it.each([42, null, undefined, {}])('is false for the non-string %j', (value) => {
    expect(isJson5(value)).toBe(false);
  });
});
