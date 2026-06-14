/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isNotBlank } from './isNotBlank';

describe('isNotBlank', () => {
  it('should return true for strings with visible content', () => {
    expect(isNotBlank('foo')).toBe(true);
    expect(isNotBlank(' x ')).toBe(true);
    expect(isNotBlank('0')).toBe(true);
  });

  it('should return true for strings containing zero-width characters', () => {
    expect(isNotBlank('​')).toBe(true); // zero-width space — not whitespace
    expect(isNotBlank('‌')).toBe(true);
    expect(isNotBlank('‍')).toBe(true);
  });

  it('should return false for an empty string', () => {
    expect(isNotBlank('')).toBe(false);
  });

  it('should return false for ASCII whitespace-only strings', () => {
    expect(isNotBlank(' ')).toBe(false);
    expect(isNotBlank('\t')).toBe(false);
    expect(isNotBlank('\n')).toBe(false);
    expect(isNotBlank(' \t\n\r ')).toBe(false);
  });

  it('should return false for Unicode whitespace-only strings', () => {
    expect(isNotBlank(' ')).toBe(false); // non-breaking space
    expect(isNotBlank(' ')).toBe(false); // em space
    expect(isNotBlank('　')).toBe(false); // ideographic space
    expect(isNotBlank('﻿')).toBe(false); // BOM
  });
});
