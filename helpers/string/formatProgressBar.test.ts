/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { formatProgressBar } from './formatProgressBar';

describe('formatProgressBar', () => {
  it('renders a default 20-cell bar with default characters', () => {
    expect(formatProgressBar(65)).toBe('▓'.repeat(13) + '░'.repeat(7));
  });

  it('renders a fully empty bar at 0%', () => {
    expect(formatProgressBar(0)).toBe('░'.repeat(20));
  });

  it('renders a fully filled bar at 100%', () => {
    expect(formatProgressBar(100)).toBe('▓'.repeat(20));
  });

  it('clamps values above max to a fully filled bar', () => {
    expect(formatProgressBar(150)).toBe('▓'.repeat(20));
  });

  it('clamps negative values to a fully empty bar', () => {
    expect(formatProgressBar(-10)).toBe('░'.repeat(20));
  });

  it('supports a custom width', () => {
    expect(formatProgressBar(50, { width: 10 })).toBe('▓'.repeat(5) + '░'.repeat(5));
  });

  it('supports a custom max', () => {
    expect(formatProgressBar(3, { width: 10, max: 5, filledChar: '#', emptyChar: '-' })).toBe('######----');
  });

  it('treats max <= 0 as an empty bar', () => {
    expect(formatProgressBar(5, { max: 0 })).toBe('░'.repeat(20));
    expect(formatProgressBar(5, { max: -10 })).toBe('░'.repeat(20));
  });

  it('treats NaN value as an empty bar', () => {
    expect(formatProgressBar(Number.NaN)).toBe('░'.repeat(20));
  });

  it('rounds a non-integer width', () => {
    expect(formatProgressBar(50, { width: 9.6 })).toHaveLength(10);
  });

  it('clamps a negative width to zero cells', () => {
    expect(formatProgressBar(50, { width: -5 })).toBe('');
  });

  it('supports multi-character fill strings', () => {
    expect(formatProgressBar(100, { width: 3, filledChar: '██' })).toBe('██'.repeat(3));
  });
});
