/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { slugify } from './slugify';

describe('slugify', () => {
  it('should convert words to lowercase hyphen-separated slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should trim surrounding whitespace', () => {
    expect(slugify('  hello world  ')).toBe('hello-world');
  });

  it('should collapse repeated separators', () => {
    expect(slugify('hello___world---again')).toBe('hello-world-again');
  });

  it('should remove punctuation', () => {
    expect(slugify('Hello, world! This is great.')).toBe('hello-world-this-is-great');
  });

  it('should remove apostrophes', () => {
    expect(slugify("L'été d'aujourd'hui")).toBe('lete-daujourdhui');
  });

  it('should remove diacritics', () => {
    expect(slugify('Crème brûlée à la vanille')).toBe('creme-brulee-a-la-vanille');
  });

  it('should preserve digits', () => {
    expect(slugify('Version 2.0 release')).toBe('version-2-0-release');
  });

  it('should return empty string for empty input', () => {
    expect(slugify('')).toBe('');
  });

  it('should return empty string when only symbols are provided', () => {
    expect(slugify('---___!!!')).toBe('');
  });

  it('should avoid leading and trailing hyphens', () => {
    expect(slugify('---Hello world---')).toBe('hello-world');
  });
});
