/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isJsonc } from './isJsonc';

describe('isJsonc', () => {
  it.each(['{"a":1}', '{"a":1, // c\n}', '[1,/* c */2,]', 'null'])('is true for %j', (value) => {
    expect(isJsonc(value)).toBe(true);
  });

  it('accepts a leading byte order mark', () => {
    expect(isJsonc('\uFEFF{"a":1,}')).toBe(true);
  });

  it.each(["{'a':1}", '{a:1}', '', 'not json'])('is false for %j', (value) => {
    expect(isJsonc(value)).toBe(false);
  });

  it.each([42, null, undefined, {}, ['{}']])('is false for the non-string %j', (value) => {
    expect(isJsonc(value)).toBe(false);
  });
});
