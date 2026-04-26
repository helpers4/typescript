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

  it('returns the string unchanged when exactly at limit', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
  });

  it('truncates with default ellipsis (…)', () => {
    expect(truncate('Hello, world!', 8)).toBe('Hello, …');
  });

  it('truncates with custom ellipsis', () => {
    expect(truncate('Hello, world!', 8, '...')).toBe('Hello...');
  });

  it('result length equals maxLength when truncated (default ellipsis)', () => {
    const result = truncate('Hello, world!', 8);
    expect(result.length).toBe(8);
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
});
