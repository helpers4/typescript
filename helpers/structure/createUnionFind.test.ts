/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { createUnionFind } from './createUnionFind';

describe('createUnionFind', () => {
  it('an item not seen before is its own singleton set', () => {
    const uf = createUnionFind<string>();
    expect(uf.find('a')).toBe('a');
    expect(uf.connected('a', 'a')).toBe(true);
  });

  it('unrelated items are not connected', () => {
    const uf = createUnionFind<string>();
    expect(uf.connected('a', 'b')).toBe(false);
  });

  it('union() merges two sets', () => {
    const uf = createUnionFind<string>();
    uf.union('a', 'b');
    expect(uf.connected('a', 'b')).toBe(true);
  });

  it('connectivity is transitive across chained unions', () => {
    const uf = createUnionFind<string>();
    uf.union('a', 'b');
    uf.union('b', 'c');
    expect(uf.connected('a', 'c')).toBe(true);
  });

  it('two separate chains stay unconnected until unioned together', () => {
    const uf = createUnionFind<string>();
    uf.union('a', 'b');
    uf.union('c', 'd');
    expect(uf.connected('a', 'c')).toBe(false);
    uf.union('b', 'c');
    expect(uf.connected('a', 'd')).toBe(true);
  });

  it('union() on already-connected items is a no-op', () => {
    const uf = createUnionFind<string>();
    uf.union('a', 'b');
    uf.union('a', 'b');
    expect(uf.connected('a', 'b')).toBe(true);
  });

  it('find() returns the same representative for every member of a set', () => {
    const uf = createUnionFind<string>();
    uf.union('a', 'b');
    uf.union('b', 'c');
    const root = uf.find('a');
    expect(uf.find('b')).toBe(root);
    expect(uf.find('c')).toBe(root);
  });

  it('works with object identity as keys', () => {
    const uf = createUnionFind<object>();
    const a = {};
    const b = {};
    const c = {};
    uf.union(a, b);
    expect(uf.connected(a, b)).toBe(true);
    expect(uf.connected(a, c)).toBe(false);
  });

  it('union by rank triggers the equal-rank branch (both single-node trees)', () => {
    const uf = createUnionFind<string>();
    uf.union('a', 'b');
    expect(uf.connected('a', 'b')).toBe(true);
  });

  it('union by rank triggers the unequal-rank branch (attach shallow under deep)', () => {
    const uf = createUnionFind<string>();
    // Build a's tree to rank 1 (a and b merged), then union with fresh singleton c.
    uf.union('a', 'b');
    uf.union('a', 'c');
    expect(uf.connected('b', 'c')).toBe(true);

    // Union a fresh pair the other way around to hit the opposite rank comparison.
    uf.union('d', 'e');
    uf.union('f', 'd');
    expect(uf.connected('e', 'f')).toBe(true);
  });

  it('path compression keeps find() correct after a long chain of unions', () => {
    const uf = createUnionFind<number>();
    for (let i = 1; i < 50; i++) uf.union(i - 1, i);
    expect(uf.connected(0, 49)).toBe(true);
    // A second find() after compression must still agree with the first.
    expect(uf.find(0)).toBe(uf.find(49));
  });
});
