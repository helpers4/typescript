/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { replaceOrAppend } from './replaceOrAppend';

describe('replaceOrAppend', () => {
  it('replaces the first item matching the predicate', () => {
    const result = replaceOrAppend(
      [{ id: 1, n: 'a' }, { id: 2, n: 'b' }],
      { id: 1, n: 'A' },
      (x) => x.id === 1,
    );
    expect(result).toEqual([{ id: 1, n: 'A' }, { id: 2, n: 'b' }]);
  });

  it('appends the item when no match is found', () => {
    const result = replaceOrAppend([{ id: 1 }], { id: 2 }, (x) => x.id === 2);
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('treats null as an empty array (always appends)', () => {
    expect(replaceOrAppend(null, 1, (x) => x === 1)).toEqual([1]);
  });

  it('treats undefined as an empty array (always appends)', () => {
    expect(replaceOrAppend(undefined, 1, (x) => x === 1)).toEqual([1]);
  });

  it('does not mutate the source array', () => {
    const source = [{ id: 1 }];
    replaceOrAppend(source, { id: 1 }, (x) => x.id === 1);
    expect(source).toEqual([{ id: 1 }]);
  });

  it('replaces only the first match, leaving later matches untouched', () => {
    const result = replaceOrAppend([1, 5, 5], 9, (x) => x === 5);
    expect(result).toEqual([1, 9, 5]);
  });

  it('preserves the position of the replaced item', () => {
    const result = replaceOrAppend(['a', 'b', 'c'], 'B', (x) => x === 'b');
    expect(result).toEqual(['a', 'B', 'c']);
  });
});
