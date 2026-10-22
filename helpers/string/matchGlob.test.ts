/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { matchGlob } from './matchGlob';

describe('matchGlob', () => {
  it('matches the whole string with * and ?', () => {
    expect(matchGlob('*.fig', 'design.fig')).toBe(true);
    expect(matchGlob('*.fig', 'design.fig.bak')).toBe(false);
    expect(matchGlob('frame-?', 'frame-1')).toBe(true);
    expect(matchGlob('frame-?', 'frame-12')).toBe(false);
  });

  it('is case-sensitive by default', () => {
    expect(matchGlob('Screen *', 'screen 2')).toBe(false);
    expect(matchGlob('Screen *', 'screen 2', false)).toBe(true);
  });

  it('treats regex characters literally', () => {
    expect(matchGlob('a.b', 'axb')).toBe(false);
    expect(matchGlob('(1)', '(1)')).toBe(true);
  });
});
