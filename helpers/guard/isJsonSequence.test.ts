/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isJsonSequence } from './isJsonSequence';

describe('isJsonSequence', () => {
  it.each(['\u001E{"id":1}\n\u001E2\n', '', '\u001E{"a":1}'])('is true for %j', (value) => {
    expect(isJsonSequence(value)).toBe(true);
  });

  it.each(['\u001E2', '{"id":1}\n', '\u001E{\n'])('is false for %j', (value) => {
    expect(isJsonSequence(value)).toBe(false);
  });

  it.each([42, null, undefined])('is false for the non-string %j', (value) => {
    expect(isJsonSequence(value)).toBe(false);
  });
});
