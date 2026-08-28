/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { formatSize } from './formatSize';

describe('formatSize — bytes (B)', () => {
  it('0 bytes', () => expect(formatSize(0)).toBe('0.0B'));
  it('1 byte', () => expect(formatSize(1)).toBe('1.0B'));
  it('512 bytes', () => expect(formatSize(512)).toBe('512.0B'));
  it('1023 bytes (just under KB)', () => expect(formatSize(1023)).toBe('1023.0B'));
});

describe('formatSize — kilobytes (KB)', () => {
  it('1024 bytes = 1.0KB', () => expect(formatSize(1024)).toBe('1.0KB'));
  it('1536 bytes = 1.5KB', () => expect(formatSize(1536)).toBe('1.5KB'));
  it('2048 bytes = 2.0KB', () => expect(formatSize(2048)).toBe('2.0KB'));
});

describe('formatSize — megabytes (MB)', () => {
  it('1_048_576 bytes = 1.0MB', () => expect(formatSize(1_048_576)).toBe('1.0MB'));
  it('2_097_152 bytes = 2.0MB', () => expect(formatSize(2_097_152)).toBe('2.0MB'));
});

describe('formatSize — gigabytes (GB)', () => {
  it('1_073_741_824 bytes = 1.0GB', () => expect(formatSize(1_073_741_824)).toBe('1.0GB'));
});

describe('formatSize — terabytes (TB)', () => {
  it('1_099_511_627_776 bytes = 1.0TB', () => expect(formatSize(1_099_511_627_776)).toBe('1.0TB'));
  it('large value stays in TB', () => expect(formatSize(5 * 1_099_511_627_776)).toBe('5.0TB'));
});

describe('formatSize — decimal formatting', () => {
  it('always has exactly one decimal place', () => {
    for (const input of [0, 1, 1024, 1_048_576]) {
      expect(formatSize(input)).toMatch(/\.\d[A-Z]/);
    }
  });
});

describe('formatSize — unitSeparator option', () => {
  it('defaults to no separator', () => expect(formatSize(1536)).toBe('1.5KB'));
  it('inserts the given separator between number and unit', () => expect(formatSize(1536, { unitSeparator: ' ' })).toBe('1.5 KB'));
  it('works together with the base unit', () => expect(formatSize(512, { unitSeparator: ' ' })).toBe('512.0 B'));
});

describe('formatSize — integerBelowFirstUnit option', () => {
  it('defaults to false (keeps the decimal below the first unit)', () => expect(formatSize(512)).toBe('512.0B'));
  it('prints a bare integer below the first unit when enabled', () => expect(formatSize(512, { integerBelowFirstUnit: true })).toBe('512B'));
  it('does not affect units at KB and above', () => expect(formatSize(1536, { integerBelowFirstUnit: true })).toBe('1.5KB'));
  it('combines with unitSeparator', () => expect(formatSize(512, { unitSeparator: ' ', integerBelowFirstUnit: true })).toBe('512 B'));
});
