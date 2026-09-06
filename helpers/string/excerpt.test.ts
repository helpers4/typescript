/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { excerpt } from './excerpt';

describe('excerpt', () => {
  it('returns the text unchanged when already within the limit', () => {
    expect(excerpt('A short game about ducks.', 200)).toBe('A short game about ducks.');
  });

  it('cuts at the first sentence boundary when one exists within the limit', () => {
    const text =
      'Take a trip to fame and fortune by building the biggest, best, scariest, and most thrilling rides ever seen in any theme park. Can you make money in this volatile business? One of the best games from the acclaimed Tycoon series, with well designed levels and engaging gameplay.';
    expect(excerpt(text, 200)).toBe(
      'Take a trip to fame and fortune by building the biggest, best, scariest, and most thrilling rides ever seen in any theme park.',
    );
  });

  it('falls back to the last whole word with an ellipsis when no sentence boundary is within the limit', () => {
    const text = `${'a'.repeat(50)} ${'b'.repeat(300)}`;
    const result = excerpt(text, 60);
    expect(result.length).toBeLessThanOrEqual(60);
    expect(result.endsWith('…')).toBe(true);
    expect(result).not.toContain(' b');
  });

  it('collapses internal whitespace (line breaks, repeated spaces) before measuring length', () => {
    expect(excerpt('Line one.\r\n\r\nLine   two.', 200)).toBe('Line one. Line two.');
  });

  it('never exceeds maxLength, including the ellipsis', () => {
    const text = 'a'.repeat(500);
    const result = excerpt(text, 60);
    expect(result.length).toBeLessThanOrEqual(60);
  });

  it('supports a custom ellipsis', () => {
    const text = `${'a'.repeat(50)} ${'b'.repeat(300)}`;
    expect(excerpt(text, 60, '...').endsWith('...')).toBe(true);
  });

  it('delegates to a grapheme-safe cut when there is no word boundary at all', () => {
    const text = 'x'.repeat(300);
    expect(excerpt(text, 60)).toBe(`${'x'.repeat(59)}…`);
  });
});
