/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isConventionalCommit } from './isConventionalCommit';

describe('isConventionalCommit', () => {
  it('accepts well-formed subjects', () => {
    expect(isConventionalCommit('feat: x')).toBe(true);
    expect(isConventionalCommit('fix(api): x')).toBe(true);
    expect(isConventionalCommit('feat(api)!: x')).toBe(true);
  });

  it('rejects malformed subjects', () => {
    expect(isConventionalCommit('hello')).toBe(false);
    expect(isConventionalCommit('feat:no-space')).toBe(false);
    expect(isConventionalCommit('')).toBe(false);
  });

  it('only inspects the first line', () => {
    expect(isConventionalCommit('feat: x\n\nbroken footer')).toBe(true);
    expect(isConventionalCommit('garbage\nfeat: x')).toBe(false);
  });

  it('returns false for non-string inputs', () => {
    // @ts-expect-error testing runtime guard
    expect(isConventionalCommit(undefined)).toBe(false);
    // @ts-expect-error testing runtime guard
    expect(isConventionalCommit(null)).toBe(false);
    // @ts-expect-error testing runtime guard
    expect(isConventionalCommit(42)).toBe(false);
  });

  it('forwards options to the regex builder', () => {
    expect(isConventionalCommit('feat: x', { types: ['feat'] })).toBe(true);
    expect(isConventionalCommit('chore: x', { types: ['feat'] })).toBe(false);
    expect(isConventionalCommit('feat: x', { requireScope: true })).toBe(false);
    expect(isConventionalCommit('feat(api): x', { requireScope: true })).toBe(true);
  });
});
