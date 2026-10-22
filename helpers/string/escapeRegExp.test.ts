/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { escapeRegExp } from './escapeRegExp';

describe('escapeRegExp', () => {
  it('escapes every regex metacharacter', () => {
    expect(escapeRegExp('.*+?^${}()|[]\\')).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
  });

  it('leaves plain text unchanged', () => {
    expect(escapeRegExp('hello world 123')).toBe('hello world 123');
  });

  it('returns an empty string for an empty input', () => {
    expect(escapeRegExp('')).toBe('');
  });

  it('produces a pattern that matches the original string literally', () => {
    const input = '1 + 1 = 2?';
    const pattern = new RegExp(escapeRegExp(input));
    expect(pattern.test(input)).toBe(true);
    expect(pattern.test('1 X 1 = 2Y')).toBe(false);
  });

  it('escapes a mix of special and normal characters in place', () => {
    expect(escapeRegExp('a.b*c')).toBe('a\\.b\\*c');
  });
});
