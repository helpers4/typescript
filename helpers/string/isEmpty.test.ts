/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isEmpty } from './isEmpty';

describe('isEmpty', () => {
  it('should return true for an empty string', () => {
    expect(isEmpty('')).toBe(true);
  });

  it('should return false for a whitespace-only string', () => {
    expect(isEmpty(' ')).toBe(false);
    expect(isEmpty('   ')).toBe(false);
    expect(isEmpty('\t')).toBe(false);
    expect(isEmpty('\n')).toBe(false);
  });

  it('should return false for a non-empty string', () => {
    expect(isEmpty('a')).toBe(false);
    expect(isEmpty('hello')).toBe(false);
  });

  it('should narrow type to empty string literal in true branch', () => {
    const s: string = '';
    if (isEmpty(s)) {
      const _: '' = s;
      expect(_).toBe('');
    }
  });
});
