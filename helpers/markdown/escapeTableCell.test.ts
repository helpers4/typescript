/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { escapeTableCell } from './escapeTableCell';

describe('escapeTableCell', () => {
  it('escapes pipe characters', () => {
    expect(escapeTableCell('foo | bar')).toBe('foo \\| bar');
  });

  it('escapes backslashes', () => {
    expect(escapeTableCell('a\\b')).toBe('a\\\\b');
  });

  it('replaces newlines with spaces', () => {
    expect(escapeTableCell('line1\nline2')).toBe('line1 line2');
  });

  it('handles multiple special characters', () => {
    expect(escapeTableCell('a\\b|c\nd')).toBe('a\\\\b\\|c d');
  });

  it('returns empty string unchanged', () => {
    expect(escapeTableCell('')).toBe('');
  });

  it('returns plain text unchanged', () => {
    expect(escapeTableCell('hello world')).toBe('hello world');
  });
});
