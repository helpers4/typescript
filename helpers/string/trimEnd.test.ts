/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { trimEnd } from './trimEnd';

const NBSP = String.fromCharCode(0x00a0);
const FIGURE_SPACE = String.fromCharCode(0x2007);
const NARROW_NBSP = String.fromCharCode(0x202f);
const EM_SPACE = String.fromCharCode(0x2003);
const IDEOGRAPHIC_SPACE = String.fromCharCode(0x3000);
const BOM = String.fromCharCode(0xfeff);
const ZWSP = String.fromCharCode(0x200b);
const ZWJ = String.fromCharCode(0x200d);
const WORD_JOINER = String.fromCharCode(0x2060);

describe('trimEnd', () => {
  it('returns undefined when input is undefined', () => {
    expect(trimEnd(undefined)).toBeUndefined();
  });

  it('returns null when input is null', () => {
    expect(trimEnd(null)).toBeNull();
  });

  it('defaults to "whitespace" mode, matching String.prototype.trimEnd', () => {
    expect(trimEnd('Hello   ')).toBe('Hello');
    expect(trimEnd('Hello' + NBSP)).toBe('Hello');
    expect(trimEnd('Hello' + BOM)).toBe('Hello');
  });

  describe('mode: wrappable', () => {
    it('strips regular breakable whitespace', () => {
      expect(trimEnd('Hello   ', 'wrappable')).toBe('Hello');
      expect(trimEnd('Hello\t\n', 'wrappable')).toBe('Hello');
      expect(trimEnd('Hello' + EM_SPACE, 'wrappable')).toBe('Hello');
      expect(trimEnd('Hello' + IDEOGRAPHIC_SPACE, 'wrappable')).toBe('Hello');
    });

    it('preserves a trailing non-breaking space', () => {
      expect(trimEnd('Hello' + NBSP, 'wrappable')).toBe('Hello' + NBSP);
      expect(trimEnd('Hello' + FIGURE_SPACE, 'wrappable')).toBe('Hello' + FIGURE_SPACE);
      expect(trimEnd('Hello' + NARROW_NBSP, 'wrappable')).toBe('Hello' + NARROW_NBSP);
    });

    it('preserves a trailing BOM/zero-width character', () => {
      expect(trimEnd('Hello' + BOM, 'wrappable')).toBe('Hello' + BOM);
      expect(trimEnd('Hello' + ZWSP, 'wrappable')).toBe('Hello' + ZWSP);
    });
  });

  describe('mode: separator', () => {
    it('strips both breakable and non-breaking spaces', () => {
      expect(trimEnd('Hello   ', 'separator')).toBe('Hello');
      expect(trimEnd('Hello' + NBSP, 'separator')).toBe('Hello');
      expect(trimEnd('Hello' + FIGURE_SPACE, 'separator')).toBe('Hello');
      expect(trimEnd('Hello' + NARROW_NBSP, 'separator')).toBe('Hello');
    });

    it('preserves a trailing BOM/zero-width character', () => {
      expect(trimEnd('Hello' + BOM, 'separator')).toBe('Hello' + BOM);
      expect(trimEnd('Hello' + ZWJ, 'separator')).toBe('Hello' + ZWJ);
    });
  });

  describe('mode: whitespace', () => {
    it('strips everything String.prototype.trimEnd strips, including BOM', () => {
      expect(trimEnd('Hello   ', 'whitespace')).toBe('Hello');
      expect(trimEnd('Hello' + NBSP, 'whitespace')).toBe('Hello');
      expect(trimEnd('Hello' + BOM, 'whitespace')).toBe('Hello');
    });

    it('preserves a trailing zero-width joiner/space character', () => {
      expect(trimEnd('Hello' + ZWSP, 'whitespace')).toBe('Hello' + ZWSP);
      expect(trimEnd('Hello' + ZWJ, 'whitespace')).toBe('Hello' + ZWJ);
      expect(trimEnd('Hello' + WORD_JOINER, 'whitespace')).toBe('Hello' + WORD_JOINER);
    });
  });

  describe('mode: unicode', () => {
    it('strips everything, including zero-width joiners/spaces', () => {
      expect(trimEnd('Hello' + ZWSP, 'unicode')).toBe('Hello');
      expect(trimEnd('Hello' + ZWJ, 'unicode')).toBe('Hello');
      expect(trimEnd('Hello' + WORD_JOINER, 'unicode')).toBe('Hello');
      expect(trimEnd('Hello' + NBSP + ZWSP, 'unicode')).toBe('Hello');
    });
  });

  it('handles an empty string', () => {
    expect(trimEnd('')).toBe('');
    expect(trimEnd('', 'unicode')).toBe('');
  });

  it('handles a string of only trimmable characters', () => {
    expect(trimEnd('   ', 'whitespace')).toBe('');
  });

  it('does not touch leading or interior whitespace', () => {
    expect(trimEnd('  Hello  World  ')).toBe('  Hello  World');
  });
});
