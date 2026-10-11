/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isNdjson } from './isNdjson';

describe('isNdjson', () => {
  it.each(['{"id":1}\n{"id":2}\n', '1', '', '1\n\n2'])('is true for %j', (value) => {
    expect(isNdjson(value)).toBe(true);
  });

  it.each(['{"id":1}\n{"id":', '{\n"a":1\n}', '{"a":1} // c'])('is false for %j', (value) => {
    expect(isNdjson(value)).toBe(false);
  });

  it.each([42, null, undefined, ['1']])('is false for the non-string %j', (value) => {
    expect(isNdjson(value)).toBe(false);
  });
});
