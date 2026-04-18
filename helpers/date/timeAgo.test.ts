/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { timeAgo } from './timeAgo';

const NOW = '2025-01-19T12:00:00Z';

describe('timeAgo — past dates', () => {
  it('returns "X seconds ago" for < 1 minute', () => {
    const result = timeAgo('2025-01-19T11:59:30Z', { now: NOW, numeric: 'always' });
    expect(result).toBe('30 seconds ago');
  });

  it('returns "X minutes ago" for < 1 hour', () => {
    const result = timeAgo('2025-01-19T11:30:00Z', { now: NOW, numeric: 'always' });
    expect(result).toBe('30 minutes ago');
  });

  it('returns "X hours ago" for < 1 day', () => {
    const result = timeAgo('2025-01-19T06:00:00Z', { now: NOW, numeric: 'always' });
    expect(result).toBe('6 hours ago');
  });

  it('returns "X days ago" for < 1 month', () => {
    const result = timeAgo('2025-01-14T12:00:00Z', { now: NOW, numeric: 'always' });
    expect(result).toBe('5 days ago');
  });

  it('returns "X months ago" for < 1 year', () => {
    const result = timeAgo('2024-09-19T12:00:00Z', { now: NOW, numeric: 'always' });
    expect(result).toBe('4 months ago');
  });

  it('returns "X years ago" for >= 1 year', () => {
    const result = timeAgo('2023-01-19T12:00:00Z', { now: NOW, numeric: 'always' });
    expect(result).toBe('2 years ago');
  });
});

describe('timeAgo — future dates', () => {
  it('returns "in X seconds" for < 1 minute ahead', () => {
    const result = timeAgo('2025-01-19T12:00:15Z', { now: NOW, numeric: 'always' });
    expect(result).toBe('in 15 seconds');
  });

  it('returns "in X minutes" for < 1 hour ahead', () => {
    const result = timeAgo('2025-01-19T12:45:00Z', { now: NOW, numeric: 'always' });
    expect(result).toBe('in 45 minutes');
  });

  it('returns "in X hours" for < 1 day ahead', () => {
    const result = timeAgo('2025-01-19T18:00:00Z', { now: NOW, numeric: 'always' });
    expect(result).toBe('in 6 hours');
  });

  it('returns "in X days" for < 1 month ahead', () => {
    const result = timeAgo('2025-01-26T12:00:00Z', { now: NOW, numeric: 'always' });
    expect(result).toBe('in 7 days');
  });

  it('returns "in X months" for < 1 year ahead', () => {
    const result = timeAgo('2025-07-19T12:00:00Z', { now: NOW, numeric: 'always' });
    expect(result).toBe('in 6 months');
  });

  it('returns "in X years" for >= 1 year ahead', () => {
    const result = timeAgo('2028-01-19T12:00:00Z', { now: NOW, numeric: 'always' });
    expect(result).toBe('in 3 years');
  });
});

describe('timeAgo — edge cases', () => {
  it('returns "now" for identical dates with numeric auto', () => {
    const result = timeAgo(NOW, { now: NOW });
    expect(result).toBe('now');
  });

  it('returns "0 seconds ago" for identical dates with numeric always', () => {
    const result = timeAgo(NOW, { now: NOW, numeric: 'always' });
    expect(result).toBe('in 0 seconds');
  });

  it('returns "yesterday" with numeric auto', () => {
    const result = timeAgo('2025-01-18T12:00:00Z', { now: NOW });
    expect(result).toBe('yesterday');
  });

  it('returns "tomorrow" with numeric auto', () => {
    const result = timeAgo('2025-01-20T12:00:00Z', { now: NOW });
    expect(result).toBe('tomorrow');
  });

  it('returns null for invalid date', () => {
    expect(timeAgo('invalid', { now: NOW })).toBeNull();
  });

  it('returns null for invalid now', () => {
    expect(timeAgo(NOW, { now: 'invalid' })).toBeNull();
  });

  it('uses Date.now() when no now is provided', () => {
    const result = timeAgo('2020-01-01T00:00:00Z');
    expect(result).not.toBeNull();
    expect(result).toContain('years ago');
  });
});

describe('timeAgo — DateLike inputs', () => {
  it('accepts Date objects', () => {
    const result = timeAgo(new Date('2025-01-14T12:00:00Z'), {
      now: new Date(NOW),
      numeric: 'always',
    });
    expect(result).toBe('5 days ago');
  });

  it('accepts timestamps', () => {
    const ts = new Date('2025-01-14T12:00:00Z').getTime();
    const nowTs = new Date(NOW).getTime();
    const result = timeAgo(ts, { now: nowTs, numeric: 'always' });
    expect(result).toBe('5 days ago');
  });
});

describe('timeAgo — locale support', () => {
  it('formats in French', () => {
    const result = timeAgo('2025-01-14T12:00:00Z', {
      now: NOW,
      locale: 'fr',
      numeric: 'always',
    });
    expect(result).toContain('5');
    // Intl output varies, but should contain jour(s)
    expect(result?.toLowerCase()).toMatch(/jour/);
  });

  it('formats in German', () => {
    const result = timeAgo('2025-01-14T12:00:00Z', {
      now: NOW,
      locale: 'de',
      numeric: 'always',
    });
    expect(result).toContain('5');
    expect(result?.toLowerCase()).toMatch(/tag/);
  });
});
