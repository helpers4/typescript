/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { combineSortFns } from './combineSortFns';
import { reverseSortFn } from './reverseSortFn';
import { createSortByNumberFn, createSortByStringFn } from './sortBy';

describe('reverseSortFn', () => {
  interface Release { date: string; repo: string }
  const releases: Release[] = [
    { date: '2026-01-01', repo: 'b' },
    { date: '2026-03-01', repo: 'b' },
    { date: '2026-03-01', repo: 'a' },
  ];

  it('sorts in descending order', () => {
    const sorted = [...releases].sort(reverseSortFn(createSortByStringFn<Release>('date')));
    expect(sorted.map(r => r.date)).toEqual(['2026-03-01', '2026-03-01', '2026-01-01']);
  });

  it('composes with combineSortFns for a mixed order', () => {
    const sorted = [...releases].sort(
      combineSortFns(reverseSortFn(createSortByStringFn<Release>('date')), createSortByStringFn<Release>('repo')),
    );
    expect(sorted).toEqual([
      { date: '2026-03-01', repo: 'a' },
      { date: '2026-03-01', repo: 'b' },
      { date: '2026-01-01', repo: 'b' },
    ]);
  });

  it('keeps ties as ties', () => {
    const fn = reverseSortFn(createSortByNumberFn<{ n: number }>('n'));
    expect(fn({ n: 1 }, { n: 1 })).toBe(0);
  });

  it('reversing twice restores the original order', () => {
    const asc = createSortByNumberFn<{ n: number }>('n');
    expect(reverseSortFn(reverseSortFn(asc))({ n: 1 }, { n: 2 })).toBe(asc({ n: 1 }, { n: 2 }));
  });
});
