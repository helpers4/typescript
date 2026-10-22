/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { createUnionFind } from './createUnionFind';

describe('createUnionFind — property-based', () => {
  it('connected() is reflexive for any item, seen or not', () => {
    fc.assert(
      fc.property(fc.integer(), (item) => {
        const uf = createUnionFind<number>();
        expect(uf.connected(item, item)).toBe(true);
      }),
    );
  });

  it('connected() is symmetric', () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(fc.integer({ min: 0, max: 20 }), fc.integer({ min: 0, max: 20 }))), (pairs) => {
        const uf = createUnionFind<number>();
        for (const [a, b] of pairs) uf.union(a, b);
        for (const [a, b] of pairs) {
          expect(uf.connected(a, b)).toBe(uf.connected(b, a));
        }
      }),
    );
  });

  it('matches a naive reference partition built from the same unions', () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(fc.integer({ min: 0, max: 15 }), fc.integer({ min: 0, max: 15 }))), (pairs) => {
        const uf = createUnionFind<number>();

        // Reference model: a plain array of groups (arrays of numbers), merged
        // the naive O(n) way, to compare against the union-find's answers.
        const groups: number[][] = [];
        const groupOf = (item: number): number[] => {
          const existing = groups.find((g) => g.includes(item));
          if (existing) return existing;
          const created = [item];
          groups.push(created);
          return created;
        };
        const naiveUnion = (a: number, b: number): void => {
          const groupA = groupOf(a);
          const groupB = groupOf(b);
          if (groupA === groupB) return;
          groupA.push(...groupB);
          groups.splice(groups.indexOf(groupB), 1);
        };
        const naiveConnected = (a: number, b: number): boolean => groupOf(a) === groupOf(b);

        for (const [a, b] of pairs) {
          uf.union(a, b);
          naiveUnion(a, b);
        }
        for (const [a, b] of pairs) {
          expect(uf.connected(a, b)).toBe(naiveConnected(a, b));
        }
      }),
    );
  });
});

describe('createUnionFind — contract', () => {
  it('a brand new instance has no connections at all', () => {
    const uf = createUnionFind<string>();
    expect(uf.connected('x', 'y')).toBe(false);
  });
});
