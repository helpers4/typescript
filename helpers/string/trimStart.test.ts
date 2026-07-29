/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { trimStart } from './trimStart';

const NBSP = String.fromCharCode(0x00a0);
const FIGURE_SPACE = String.fromCharCode(0x2007);
const NARROW_NBSP = String.fromCharCode(0x202f);
const EM_SPACE = String.fromCharCode(0x2003);
const BOM = String.fromCharCode(0xfeff);
const ZWSP = String.fromCharCode(0x200b);

describe('trimStart', () => {
  it('returns undefined when input is undefined', () => {
    expect(trimStart(undefined)).toBeUndefined();
  });

  it('returns null when input is null', () => {
    expect(trimStart(null)).toBeNull();
  });

  it('defaults to "whitespace" mode, matching String.prototype.trimStart', () => {
    expect(trimStart('   Hello')).toBe('Hello');
    expect(trimStart(NBSP + 'Hello')).toBe('Hello');
    expect(trimStart(BOM + 'Hello')).toBe('Hello');
  });

  describe('mode: wrappable', () => {
    it('strips regular breakable whitespace', () => {
      expect(trimStart('   Hello', 'wrappable')).toBe('Hello');
      expect(trimStart(EM_SPACE + 'Hello', 'wrappable')).toBe('Hello');
    });

    it('preserves a leading non-breaking space', () => {
      expect(trimStart(NBSP + 'Hello', 'wrappable')).toBe(NBSP + 'Hello');
      expect(trimStart(FIGURE_SPACE + 'Hello', 'wrappable')).toBe(FIGURE_SPACE + 'Hello');
      expect(trimStart(NARROW_NBSP + 'Hello', 'wrappable')).toBe(NARROW_NBSP + 'Hello');
    });

    it('preserves a leading BOM/zero-width character', () => {
      expect(trimStart(BOM + 'Hello', 'wrappable')).toBe(BOM + 'Hello');
      expect(trimStart(ZWSP + 'Hello', 'wrappable')).toBe(ZWSP + 'Hello');
    });
  });

  describe('mode: separator', () => {
    it('strips both breakable and non-breaking spaces', () => {
      expect(trimStart(NBSP + 'Hello', 'separator')).toBe('Hello');
      expect(trimStart(FIGURE_SPACE + 'Hello', 'separator')).toBe('Hello');
      expect(trimStart(NARROW_NBSP + 'Hello', 'separator')).toBe('Hello');
    });

    it('preserves a leading BOM/zero-width character', () => {
      expect(trimStart(BOM + 'Hello', 'separator')).toBe(BOM + 'Hello');
    });
  });

  describe('mode: whitespace', () => {
    it('strips everything String.prototype.trimStart strips, including BOM', () => {
      expect(trimStart(NBSP + 'Hello', 'whitespace')).toBe('Hello');
      expect(trimStart(BOM + 'Hello', 'whitespace')).toBe('Hello');
    });

    it('preserves a leading zero-width space', () => {
      expect(trimStart(ZWSP + 'Hello', 'whitespace')).toBe(ZWSP + 'Hello');
    });
  });

  describe('mode: unicode', () => {
    it('strips everything, including zero-width spaces', () => {
      expect(trimStart(ZWSP + 'Hello', 'unicode')).toBe('Hello');
      expect(trimStart(ZWSP + NBSP + 'Hello', 'unicode')).toBe('Hello');
    });
  });

  it('handles an empty string', () => {
    expect(trimStart('')).toBe('');
  });

  it('does not touch trailing or interior whitespace', () => {
    expect(trimStart('  Hello  World  ')).toBe('Hello  World  ');
  });

  it('throws a TypeError on an invalid mode instead of silently no-op-ing', () => {
    // @ts-expect-error - intentionally invalid at the type level too
    expect(() => trimStart('   Hello', 'whitepsace')).toThrow(TypeError);
    // @ts-expect-error
    expect(() => trimStart('   Hello', 'whitepsace')).toThrow(/mode must be one of/);
  });
});
