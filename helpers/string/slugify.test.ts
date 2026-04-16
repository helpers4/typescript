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

  it('should replace non-alphanumeric characters with hyphens', () => {
    expect(slugify('hello@world#test')).toBe('hello-world-test');
  });

  it('should collapse multiple consecutive hyphens into one', () => {
    expect(slugify('a---b')).toBe('a-b');
  });

  it('should remove leading hyphens only', () => {
    expect(slugify('---hello')).toBe('hello');
  });

  it('should remove trailing hyphens only', () => {
    expect(slugify('hello---')).toBe('hello');
  });

  it('should normalize unicode characters', () => {
    expect(slugify('naïve résumé')).toBe('naive-resume');
  });

  it('should produce hyphen-separated words not concatenated', () => {
    // Ensures replace(/[^a-z0-9]+/g, '-') uses '-' not ''
    const result = slugify('hello world');
    expect(result).toBe('hello-world');
    expect(result).not.toBe('helloworld');
  });

  it('should return null when given null', () => {
    expect(slugify(null)).toBeNull();
  });

  it('should return undefined when given undefined', () => {
    expect(slugify(undefined)).toBeUndefined();
  });

  // --- Mutation-killing tests ---

  // L18: .trim() removed — whitespace-only input should produce empty string
  it('should trim whitespace to produce empty slug', () => {
    expect(slugify('   ')).toBe('');
    expect(slugify('\t\n ')).toBe('');
  });

  // L25: /^-+|-+$/g -> /^-|-+$/g (only removes single leading hyphen)
  it('should remove multiple leading hyphens (not just one)', () => {
    const result = slugify('---test');
    expect(result).toBe('test');
    expect(result).not.toBe('--test');
  });

  // L25: /^-+|-+$/g -> /^-+|-$/g (only removes single trailing hyphen)
  it('should remove multiple trailing hyphens (not just one)', () => {
    const result = slugify('test---');
    expect(result).toBe('test');
    expect(result).not.toBe('test--');
  });

  // L24: /[^a-z0-9]+/g -> /[^a-z0-9]/g (removes + quantifier)
  // Without +, each non-alphanum char is separately replaced with '-'
  // 'a!!b' -> 'a--b' instead of 'a-b'
  it('should replace consecutive non-alphanumeric chars with single hyphen', () => {
    const result = slugify('a!!b');
    expect(result).toBe('a-b');
    expect(result).not.toBe('a--b');
  });

  // L26: /-{2,}/g with '' → would remove hyphens entirely
  // L26: /-{2,}/g → /-/g would replace single hyphens too
  it('should keep single hyphens and only collapse doubles', () => {
    // 'a-b' should stay 'a-b' (single hyphen preserved)
    expect(slugify('a-b')).toBe('a-b');
    // 'a--b' should become 'a-b' (double hyphen collapsed)
    expect(slugify('a - b')).toBe('a-b');
  });

  // L26: StringLiteral '-' -> '' (replacement is empty instead of hyphen)
  it('should collapse double hyphens to single hyphen, not remove them', () => {
    // Input that produces double hyphens internally
    const result = slugify('hello   world');
    expect(result).toBe('hello-world');
    expect(result).not.toBe('helloworld');
  });
});
