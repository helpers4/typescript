/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { trim } from './trim';

const NBSP = String.fromCharCode(0x00a0);
const ZWSP = String.fromCharCode(0x200b);

describe('trim', () => {
  it('returns undefined when input is undefined', () => {
    expect(trim(undefined)).toBeUndefined();
  });

  it('returns null when input is null', () => {
    expect(trim(null)).toBeNull();
  });

  it('defaults to "whitespace" mode, matching String.prototype.trim', () => {
    expect(trim('   Hello   ')).toBe('Hello');
    expect(trim(NBSP + 'Hello' + NBSP)).toBe('Hello');
  });

  it('trims both ends, not just one', () => {
    expect(trim('  Hello  World  ')).toBe('Hello  World');
  });

  it('mode: wrappable preserves non-breaking spaces on both ends', () => {
    expect(trim(NBSP + 'Hello' + NBSP, 'wrappable')).toBe(NBSP + 'Hello' + NBSP);
    expect(trim('  ' + NBSP + 'Hello' + NBSP + '  ', 'wrappable')).toBe(NBSP + 'Hello' + NBSP);
  });

  it('mode: separator strips non-breaking spaces on both ends', () => {
    expect(trim(NBSP + 'Hello' + NBSP, 'separator')).toBe('Hello');
  });

  it('mode: unicode strips zero-width characters on both ends', () => {
    expect(trim(ZWSP + 'Hello' + ZWSP, 'unicode')).toBe('Hello');
  });

  it('handles an empty string', () => {
    expect(trim('')).toBe('');
  });

  it('handles a string of only trimmable characters', () => {
    expect(trim('   ')).toBe('');
  });

  it('leaves a string with no leading/trailing whitespace unchanged', () => {
    expect(trim('Hello')).toBe('Hello');
  });
});
