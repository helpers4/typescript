/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isBlank } from './isBlank';

describe('isBlank', () => {
  it('should return true for an empty string', () => {
    expect(isBlank('')).toBe(true);
  });

  it('should return true for ASCII whitespace-only strings', () => {
    expect(isBlank(' ')).toBe(true);
    expect(isBlank('   ')).toBe(true);
    expect(isBlank('\t')).toBe(true);
    expect(isBlank('\n')).toBe(true);
    expect(isBlank('\r')).toBe(true);
    expect(isBlank('\f')).toBe(true);
    expect(isBlank('\v')).toBe(true);
    expect(isBlank(' \t\n\r ')).toBe(true);
  });

  it('should return true for Unicode whitespace-only strings', () => {
    expect(isBlank(' ')).toBe(true);  // non-breaking space
    expect(isBlank(' ')).toBe(true);  // en space
    expect(isBlank(' ')).toBe(true);  // em space
    expect(isBlank(' ')).toBe(true);  // thin space
    expect(isBlank(' ')).toBe(true);  // hair space
    expect(isBlank(' ')).toBe(true);  // narrow NBSP
    expect(isBlank('　')).toBe(true);  // ideographic space
    expect(isBlank('﻿')).toBe(true);  // BOM / ZWNBSP
  });

  it('should return false for strings with visible content', () => {
    expect(isBlank('foo')).toBe(false);
    expect(isBlank(' x ')).toBe(false);
    expect(isBlank('0')).toBe(false);
  });

  it('should not treat zero-width characters as whitespace', () => {
    expect(isBlank('​')).toBe(false); // zero-width space
    expect(isBlank('‌')).toBe(false); // zero-width non-joiner
    expect(isBlank('‍')).toBe(false); // zero-width joiner
    expect(isBlank('⁠')).toBe(false); // word joiner
  });
});
