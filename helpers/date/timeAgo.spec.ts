/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { timeAgo } from './timeAgo';

const NOW = new Date('2025-01-19T12:00:00Z');

const validDate = fc.date({
  min: new Date('2000-01-01'),
  max: new Date('2050-12-31'),
  noInvalidDate: true,
});

describe('timeAgo — property-based', () => {
  it('never returns null for valid inputs', () => {
    fc.assert(
      fc.property(validDate, (d) => {
        const result = timeAgo(d, { now: NOW, numeric: 'always' });
        expect(result).not.toBeNull();
      })
    );
  });

  it('returns a non-empty string for valid inputs', () => {
    fc.assert(
      fc.property(validDate, (d) => {
        const result = timeAgo(d, { now: NOW, numeric: 'always' });
        expect(result!.length).toBeGreaterThan(0);
      })
    );
  });

  it('past dates produce "ago" in English', () => {
    fc.assert(
      fc.property(
        fc.date({
          min: new Date('2000-01-01'),
          max: new Date('2025-01-19T11:59:00Z'),
          noInvalidDate: true,
        }),
        (d) => {
          const result = timeAgo(d, { now: NOW, numeric: 'always' });
          expect(result).toMatch(/ago/);
        }
      )
    );
  });

  it('future dates produce "in" in English', () => {
    fc.assert(
      fc.property(
        fc.date({
          min: new Date('2025-01-19T12:01:00Z'),
          max: new Date('2050-12-31'),
          noInvalidDate: true,
        }),
        (d) => {
          const result = timeAgo(d, { now: NOW, numeric: 'always' });
          expect(result).toMatch(/^in /);
        }
      )
    );
  });
});

describe('timeAgo — contract', () => {
  it('string DateLike', () => {
    expect(timeAgo('2025-01-14T12:00:00Z', { now: NOW, numeric: 'always' })).toBe('5 days ago');
  });

  it('timestamp DateLike', () => {
    const ts = new Date('2025-01-14T12:00:00Z').getTime();
    expect(timeAgo(ts, { now: NOW, numeric: 'always' })).toBe('5 days ago');
  });

  it('invalid → null', () => {
    expect(timeAgo('nope', { now: NOW })).toBeNull();
  });
});
