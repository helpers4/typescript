/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/** A disjoint-set structure created by {@link createUnionFind}. */
export interface UnionFind<T> {
  /**
   * Returns the representative ("root") item of the set `item` belongs to. Two items are
   * in the same set exactly when `find` returns the same representative for both.
   * An item not seen before is treated as its own, brand-new singleton set.
   */
  find(item: T): T;
  /** Merges the sets containing `a` and `b` into one. A no-op if they're already in the same set. */
  union(a: T, b: T): void;
  /** Whether `a` and `b` are currently in the same set. */
  connected(a: T, b: T): boolean;
}

/**
 * Creates a disjoint-set (union-find) structure: tracks a partition of items into
 * non-overlapping sets, merging two sets in near-constant time via `union`, and answering
 * "are these in the same set?" via `connected` — the classic tool for clustering items by
 * an equivalence relation built up incrementally (e.g. grouping records that pairwise match
 * on some criterion into connected components), without recomputing the whole partition
 * from scratch after every new match.
 *
 * Uses union-by-rank and path compression internally, so `find`/`union`/`connected` are all
 * near-O(1) amortized regardless of how many items or unions have been performed.
 *
 * Items are compared by `Map` key semantics (`SameValueZero`, like `Set`/`Map` themselves) —
 * so object identity for objects, value equality for primitives.
 *
 * @returns A {@link UnionFind}.
 * @example
 * const uf = createUnionFind<string>();
 * uf.union('a', 'b');
 * uf.union('b', 'c');
 * uf.connected('a', 'c'); // true — merged transitively through 'b'
 * uf.connected('a', 'd'); // false — 'd' was never unioned with anything
 * @since 3.0.8
 */
export function createUnionFind<T>(): UnionFind<T> {
  const parent = new Map<T, T>();
  const rank = new Map<T, number>();

  function find(item: T): T {
    if (!parent.has(item)) {
      parent.set(item, item);
      rank.set(item, 0);
      return item;
    }

    let root = item;
    while (parent.get(root) !== root) root = parent.get(root)!;

    // Path compression: repoint every visited node directly to the root, so the
    // next find() for any of them is O(1) instead of retracing the same chain.
    let current = item;
    while (current !== root) {
      const next = parent.get(current)!;
      parent.set(current, root);
      current = next;
    }

    return root;
  }

  return {
    find,
    union(a: T, b: T): void {
      const rootA = find(a);
      const rootB = find(b);
      if (rootA === rootB) return;

      // Union by rank: attach the shallower tree under the deeper one's root, so
      // repeated unions don't degenerate into a single long chain. On equal
      // ranks, either attach direction is fine, but the resulting tree grew
      // one level deeper, so the new root's rank must be bumped.
      const rankA = rank.get(rootA)!;
      const rankB = rank.get(rootB)!;
      if (rankA < rankB) {
        parent.set(rootA, rootB);
      } else {
        parent.set(rootB, rootA);
        if (rankA === rankB) rank.set(rootA, rankA + 1);
      }
    },
    connected(a: T, b: T): boolean {
      return find(a) === find(b);
    },
  };
}
