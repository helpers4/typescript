/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { truncate } from './truncate';

describe('truncate', () => {
  it('returns the string unchanged when within limit', () => {
    expect(truncate('Hello', 10)).toBe('Hello');
  });

  it('returns undefined when input is undefined', () => {
    expect(truncate(undefined, 10)).toBeUndefined();
  });

  it('returns null when input is null', () => {
    expect(truncate(null, 10)).toBeNull();
  });

  it('returns the string unchanged when exactly at limit', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
  });

  it('truncates with default ellipsis (…), trimming a trailing space at the cut', () => {
    expect(truncate('Hello, world!', 8)).toBe('Hello,…');
  });

  it('truncates with custom ellipsis', () => {
    expect(truncate('Hello, world!', 8, '...')).toBe('Hello...');
  });

  it('result length equals maxLength when the cut does not land on whitespace', () => {
    const result = truncate('Hello world!', 8);
    expect(result).toBe('Hello w…');
    expect(result.length).toBe(8);
  });

  it('result is shorter than maxLength when the cut lands right after whitespace', () => {
    const result = truncate('Hello, world!', 8);
    expect(result.length).toBe(7);
  });

  it('result length equals maxLength when truncated (custom ellipsis)', () => {
    const result = truncate('Hello, world!', 8, '...');
    expect(result.length).toBe(8);
  });

  it('handles empty string', () => {
    expect(truncate('', 5)).toBe('');
  });

  it('handles maxLength equal to ellipsis length', () => {
    expect(truncate('Hello', 1, '…')).toBe('…');
  });

  it('handles a multi-char ellipsis longer than a short maxLength', () => {
    // ellipsis '...' is 3 chars, maxLength 2 → return ellipsis.slice(0, 2)
    expect(truncate('Hello', 2, '...')).toBe('..');
  });

  it('handles maxLength of 0', () => {
    expect(truncate('Hello', 0)).toBe('');
  });

  it('does not append ellipsis when string fits exactly', () => {
    expect(truncate('Hi', 2)).toBe('Hi');
    expect(truncate('Hi', 2)).not.toContain('…');
  });

  it('truncates a very long string', () => {
    const long = 'a'.repeat(1000);
    const result = truncate(long, 10);
    expect(result.length).toBe(10);
    expect(result.endsWith('…')).toBe(true);
  });

  it('does not trim a non-breaking space (U+00A0) at the cut point', () => {
    const result = truncate('Hello, world!', 8);
    expect(result).toBe('Hello, …');
    expect(result.length).toBe(8);
  });

  it('drops an incomplete surrogate pair at the cut point instead of emitting malformed UTF-16', () => {
    const result = truncate('a😀b', 3);
    expect(result).toBe('a…');
    expect(result).toBe(result.toWellFormed());
  });

  it('drops both a trailing space and the incomplete surrogate it exposes', () => {
    // Cutting at 4 lands on the high surrogate of 😀; after dropping it, the
    // space right before it becomes the new trailing character and must also
    // be trimmed (regular space, not NBSP).
    const result = truncate('hi 😀', 4);
    expect(result).toBe('hi…');
    expect(result).toBe(result.toWellFormed());
  });

  it('handles a slice that is only a lone high surrogate (nothing else left)', () => {
    // '😀x' is 3 UTF-16 code units (high surrogate, low surrogate, 'x'); slicing
    // to 1 code unit (maxLength 2 - ellipsis 1) keeps only the high surrogate,
    // which then gets dropped entirely, leaving just the ellipsis.
    const result = truncate('😀x', 2);
    expect(result).toBe('…');
    expect(result).toBe(result.toWellFormed());
  });
});
