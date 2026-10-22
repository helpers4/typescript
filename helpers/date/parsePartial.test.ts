/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { parsePartial } from './parsePartial';

describe('parsePartial', () => {
  it('anchors a year in the middle of the year', () => {
    expect(parsePartial('2008')).toEqual({ date: new Date('2008-07-01T00:00:00.000Z'), precision: 'year' });
  });

  it('anchors a month on its 15th', () => {
    expect(parsePartial('2008-03')).toEqual({ date: new Date('2008-03-15T00:00:00.000Z'), precision: 'month' });
  });

  it('keeps a full day as is', () => {
    expect(parsePartial('2008-03-09')).toEqual({ date: new Date('2008-03-09T00:00:00.000Z'), precision: 'day' });
  });

  it('accepts 29 February only in a leap year', () => {
    expect(parsePartial('2024-02-29')?.precision).toBe('day');
    expect(parsePartial('2023-02-29')).toBeNull();
  });

  it('handles years below 100 without mapping them to the 1900s', () => {
    expect(parsePartial('0050')?.date.getUTCFullYear()).toBe(50);
  });

  it.each(['', '2008-', '08', '2008-3', '2008-13', '2008-00', '2008-02-30', '2008-03-32', '2008-03-00', ' 2008', '2008-03-09T00:00:00Z', 'abcd'])(
    'rejects %j',
    (input) => {
      expect(parsePartial(input)).toBeNull();
    },
  );
});
