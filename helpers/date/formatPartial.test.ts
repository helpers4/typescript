/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { formatPartial } from './formatPartial';

describe('formatPartial', () => {
  it('prefixes an approximate year with "c."', () => {
    expect(formatPartial('2008')).toBe('c. 2008');
  });

  it('shows month and year for a month', () => {
    expect(formatPartial('2008-03')).toBe('Mar 2008');
  });

  it('shows the full day', () => {
    expect(formatPartial('2008-03-09')).toBe('Mar 9, 2008');
  });

  it('does not depend on the machine timezone for the edges of a period', () => {
    expect(formatPartial('2008-01-01')).toBe('Jan 1, 2008');
    expect(formatPartial('2008-12-31')).toBe('Dec 31, 2008');
  });

  it('returns null for an invalid date', () => {
    expect(formatPartial('2008-13')).toBeNull();
    expect(formatPartial('nope')).toBeNull();
  });
});
