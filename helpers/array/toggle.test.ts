/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { toggle } from './toggle';

describe('toggle', () => {
  it('removes the item when present', () => {
    expect(toggle([1, 2, 3], 2)).toEqual([1, 3]);
  });

  it('appends the item when absent', () => {
    expect(toggle([1, 3], 2)).toEqual([1, 3, 2]);
  });

  it('treats null as an empty array', () => {
    expect(toggle(null, 1)).toEqual([1]);
  });

  it('treats undefined as an empty array', () => {
    expect(toggle(undefined, 1)).toEqual([1]);
  });

  it('does not mutate the source array', () => {
    const source = [1, 2, 3];
    toggle(source, 2);
    expect(source).toEqual([1, 2, 3]);
  });

  it('removes only the first match', () => {
    expect(toggle([1, 2, 2, 3], 2)).toEqual([1, 2, 3]);
  });

  it('works with strings', () => {
    expect(toggle(['a', 'b'], 'a')).toEqual(['b']);
    expect(toggle(['a', 'b'], 'c')).toEqual(['a', 'b', 'c']);
  });

  it('toggles by a derived key when key is provided', () => {
    const items = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }];
    const result = toggle(items, { id: 1, name: 'different-object' }, (x) => x.id);
    expect(result).toEqual([{ id: 2, name: 'b' }]);
  });

  it('appends by derived key when no match is found', () => {
    const items = [{ id: 1 }];
    const result = toggle(items, { id: 2 }, (x) => x.id);
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('uses reference equality by default for objects (no key)', () => {
    const a = { id: 1 };
    const b = { id: 1 };
    // Same shape, different reference — default equality treats them as distinct.
    expect(toggle([a], b)).toEqual([{ id: 1 }, { id: 1 }]);
    expect(toggle([a], a)).toEqual([]);
  });
});
