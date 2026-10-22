/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { removeDiacritics } from './removeDiacritics';

describe('removeDiacritics', () => {
  it('strips accents from lowercase letters', () => {
    expect(removeDiacritics('café')).toBe('cafe');
    expect(removeDiacritics('naïve')).toBe('naive');
  });

  it('strips accents from uppercase letters', () => {
    expect(removeDiacritics('ÉCOLE')).toBe('ECOLE');
  });

  it('strips a variety of diacritic types', () => {
    expect(removeDiacritics('àâäéèêëïîôöùûüÿç')).toBe('aaaeeeeiioouuuyc');
  });

  it('leaves plain ASCII text unchanged', () => {
    expect(removeDiacritics('hello world')).toBe('hello world');
  });

  it('returns an empty string unchanged', () => {
    expect(removeDiacritics('')).toBe('');
  });

  it('handles a full sentence with mixed accented and plain words', () => {
    expect(removeDiacritics('Le café est très chaud')).toBe('Le cafe est tres chaud');
  });
});
