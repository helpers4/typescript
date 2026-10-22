/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { createRegexMatcher } from './createRegexMatcher';

describe('createRegexMatcher', () => {
  it('reads every string as a regular expression source', () => {
    expect(createRegexMatcher('^(Home|Login)$')('Login')).toBe(true);
    expect(createRegexMatcher('^(Home|Login)$')('Settings')).toBe(false);
    expect(createRegexMatcher('a*')('')).toBe(true);
  });

  it('supports case-insensitivity and exclusions, and throws on an invalid source', () => {
    expect(createRegexMatcher('^icon-\\d+$', { caseSensitive: false })('Icon-42')).toBe(true);
    expect(createRegexMatcher(['^a', '!b$'])('ab')).toBe(false);
    expect(() => createRegexMatcher('(')).toThrow(SyntaxError);
  });
});
