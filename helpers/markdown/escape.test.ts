/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { escape } from './escape';

describe('escape', () => {
  it('escapes asterisks', () => {
    expect(escape('**bold**')).toBe('\\*\\*bold\\*\\*');
  });

  it('escapes underscores', () => {
    expect(escape('_italic_')).toBe('\\_italic\\_');
  });

  it('escapes square brackets', () => {
    expect(escape('[link]')).toBe('\\[link\\]');
  });

  it('escapes parentheses', () => {
    expect(escape('(text)')).toBe('\\(text\\)');
  });

  it('escapes backticks', () => {
    expect(escape('`code`')).toBe('\\`code\\`');
  });

  it('escapes hash', () => {
    expect(escape('# heading')).toBe('\\# heading');
  });

  it('escapes backslashes', () => {
    expect(escape('a\\b')).toBe('a\\\\b');
  });

  it('escapes plus and minus', () => {
    expect(escape('a+b-c')).toBe('a\\+b\\-c');
  });

  it('returns empty string unchanged', () => {
    expect(escape('')).toBe('');
  });

  it('returns plain text unchanged', () => {
    expect(escape('hello world')).toBe('hello world');
  });
});
