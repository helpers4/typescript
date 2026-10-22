/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { createSafeMatcher } from './createSafeMatcher';

describe('createSafeMatcher', () => {
  it('returns the matcher for valid patterns', () => {
    expect(createSafeMatcher(['*.fig', '!draft-*'])?.('a.fig')).toBe(true);
    expect(createSafeMatcher('^a$', { syntax: 'regex' })?.('a')).toBe(true);
  });

  it('returns null for an invalid regular expression', () => {
    expect(createSafeMatcher('/(/')).toBeNull();
    expect(createSafeMatcher(['*.fig', '/a/gg'])).toBeNull();
  });
});
