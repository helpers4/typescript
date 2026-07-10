/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { argbToRgb } from './argbToRgb';

describe('argbToRgb', () => {
  it('extracts pure red', () => {
    expect(argbToRgb(0xffff0000)).toBe('rgb(255,0,0)');
  });

  it('extracts pure green', () => {
    expect(argbToRgb(0xff00ff00)).toBe('rgb(0,255,0)');
  });

  it('extracts pure blue', () => {
    expect(argbToRgb(0xff0000ff)).toBe('rgb(0,0,255)');
  });

  it('ignores the alpha byte', () => {
    expect(argbToRgb(0x00ff0000)).toBe('rgb(255,0,0)');
    expect(argbToRgb(0x80ff0000)).toBe('rgb(255,0,0)');
  });

  it('handles black and white', () => {
    expect(argbToRgb(0xff000000)).toBe('rgb(0,0,0)');
    expect(argbToRgb(0xffffffff)).toBe('rgb(255,255,255)');
  });

  it('handles mixed channel values', () => {
    expect(argbToRgb(0xff123456)).toBe('rgb(18,52,86)');
  });
});
