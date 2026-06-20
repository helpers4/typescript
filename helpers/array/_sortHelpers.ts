/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 *
 * Internal helpers shared by sort.ts, sortBy.ts, and sortNatural.ts.
 * Not exported from the package barrel — tests live in _sortHelpers.test.ts.
 */

import type { SortFn } from './sort';

/**
 * Default property names checked (in order) by auto-detecting sort helpers
 * when no explicit property key is provided.
 * @ignore
 */
export const DEFAULT_SORT_STRING_PROPS = ['value', 'label', 'title', 'description'] as const;

/** Lazy singleton — case- and accent-sensitive (`sensitivity: 'variant'`). @ignore */
let stringCollatorCache: Intl.Collator | undefined;
export const getStringCollator = (): Intl.Collator =>
  (stringCollatorCache ??= new Intl.Collator(undefined, { sensitivity: 'variant' }));

/** Lazy singleton — case-insensitive but accent-sensitive (`sensitivity: 'accent'`). @ignore */
let stringCollatorInsensitiveCache: Intl.Collator | undefined;
export const getStringCollatorInsensitive = (): Intl.Collator =>
  (stringCollatorInsensitiveCache ??= new Intl.Collator(undefined, { sensitivity: 'accent' }));

/**
 * Normalises a `property` argument into an ordered key list.
 * Returns `undefined` when `property` is `undefined` — the comparator
 * will then fall back to auto-detecting a key from `DEFAULT_SORT_STRING_PROPS`.
 * An empty array `[]` produces a no-op comparator (does not auto-detect).
 * @param property - Single key, ordered list of keys, or `undefined` for auto-detect.
 * @returns Ordered key list, or `undefined` to trigger auto-detect.
 * @ignore
 */
export function normalizePropertyToKeys<T>(
  property: keyof T | readonly (keyof T)[] | undefined,
): readonly (keyof T)[] | undefined {
  if (property === undefined) return undefined;
  if (Array.isArray(property)) return property as readonly (keyof T)[];
  return [property as keyof T];
}

/**
 * Builds a comparator that walks `keys` in order using `collator`.
 * When `keys` is `undefined` it auto-detects from `DEFAULT_SORT_STRING_PROPS`:
 * checks all props **owned** by both objects and uses them as successive tiebreakers
 * (same multi-key semantics as the explicit-keys path above).
 * An empty `keys` array (`[]`) produces a no-op comparator.
 * @param collator - Collator to use for string comparison.
 * @param keys - Ordered list of keys, or `undefined` to trigger auto-detect.
 * @returns Comparator function for arrays of `T`.
 * @ignore
 */
export function buildCollatorCompareFn<T extends Record<string, unknown>>(
  collator: Intl.Collator,
  keys: readonly (keyof T)[] | undefined,
): SortFn<T> {
  return (a: T, b: T) => {
    if (keys !== undefined) {
      for (const key of keys) {
        const cmp = collator.compare(String(a[key] ?? ''), String(b[key] ?? ''));
        if (cmp !== 0) return cmp;
      }
      return 0;
    }
    for (const prop of DEFAULT_SORT_STRING_PROPS) {
      // Object.hasOwn (not `in`) — only own properties trigger auto-detect;
      // inherited value/label/title/description (e.g. Object.create({label:'x'})) are ignored.
      if (Object.hasOwn(a, prop) && Object.hasOwn(b, prop)) {
        const cmp = collator.compare(String(a[prop as keyof T] ?? ''), String(b[prop as keyof T] ?? ''));
        if (cmp !== 0) return cmp;
      }
    }
    return 0;
  };
}
