/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { cloneDeep } from './cloneDeep.js';
import { isPlainObject } from '../type/isPlainObject';
import type { MergeResult } from './_types.js';
import { UNSAFE_KEYS } from './_unsafeKeys.js';

function applyKey(
  result: Record<PropertyKey, unknown>,
  source: Record<PropertyKey, unknown>,
  key: PropertyKey,
): void {
  const resultValue = result[key];
  const sourceValue = source[key];
  if (isPlainObject(resultValue) && isPlainObject(sourceValue)) {
    result[key] = mergeDeep(
      resultValue as Record<PropertyKey, unknown>,
      sourceValue as Record<PropertyKey, unknown>,
    );
  } else if (sourceValue !== undefined) {
    result[key] = (isPlainObject(sourceValue) || Array.isArray(sourceValue))
      ? cloneDeep(sourceValue)
      : sourceValue;
  }
}

function applySource(
  result: Record<PropertyKey, unknown>,
  source: Record<PropertyKey, unknown>,
): void {
  for (const key in source) {
    if (!Object.hasOwn(source, key) || UNSAFE_KEYS.has(key)) continue;
    applyKey(result, source, key);
  }
  for (const sym of Object.getOwnPropertySymbols(source)) {
    if (!Object.prototype.propertyIsEnumerable.call(source, sym)) continue;
    applyKey(result, source, sym);
  }
}

/**
 * Merges two or more objects deeply, returning a **new** object without mutating any input.
 *
 * Sources are applied left to right. For each key:
 * - If both sides are plain objects → merged recursively into a new object.
 * - Otherwise → **later source wins** (the earlier value is overwritten).
 * - `undefined` in a source **never overwrites** an existing value.
 * - `null` in a source **does overwrite** and prevents a later source from
 *   deep-merging into that key: `mergeDeep({ a: { x: 1 } }, { a: null }, { a: { y: 2 } })`
 *   → `{ a: { y: 2 } }` — `x: 1` is permanently lost.
 * - Arrays, class instances, and all non-plain-object values are **replaced**, not merged.
 *
 * Own enumerable string and symbol keys of each source are processed at the top level;
 * inherited and non-enumerable properties are skipped. Prototype-polluting keys
 * (`__proto__`, `constructor`, `prototype`) are silently ignored.
 * **Note:** symbol keys inside nested plain-object values are not preserved — they are
 * lost when those values are deep-cloned. Only top-level symbol keys survive.
 *
 * **TypeScript return type — intersection semantics**
 *
 * The return type is `A & B & C …` (intersection of all source types). This is accurate
 * when keys are disjoint or share the same type:
 * ```ts
 * mergeDeep({ a: 1 }, { b: 'x' })           // { a: number } & { b: string }  ✓
 * mergeDeep({ a: { b: 1 } }, { a: { c: 2 } }) // { a: { b: number } & { c: number } }  ✓
 * ```
 * When the same key carries **incompatible types** across sources, the intersection
 * resolves to `never` for that key — TypeScript surfaces the conflict rather than
 * silently picking a type:
 * ```ts
 * mergeDeep({ a: 1 }, { a: 'x' })  // { a: never }  ← type conflict detected
 * ```
 * At runtime the later source always wins (`'x'`), but the `never` type signals that
 * the caller should align their source types. If intentional, cast the result.
 *
 * @param sources - Two or more objects to merge (none are mutated)
 * @returns A new object that is the deep merge of all sources
 * @example
 * mergeDeep({ a: 1, b: { c: 2 } }, { b: { d: 3 }, e: 4 })
 * // => { a: 1, b: { c: 2, d: 3 }, e: 4 }
 *
 * // Later source wins for non-object values
 * mergeDeep({ a: 1, arr: [1, 2] }, { a: 2, arr: [3] })
 * // => { a: 2, arr: [3] }
 *
 * // undefined never overwrites
 * mergeDeep({ a: 1 }, { a: undefined })
 * // => { a: 1 }
 *
 * // Three sources, left to right
 * mergeDeep({ x: 1 }, { y: 2 }, { x: 99, z: 3 })
 * // => { x: 99, y: 2, z: 3 }
 * @since 1.9.0
 */
export function mergeDeep<T extends [object, ...object[]]>(...sources: [...T]): MergeResult<T>;
export function mergeDeep(...sources: object[]): object {
  const result: Record<PropertyKey, unknown> = {};
  for (const source of sources) {
    if (source !== null && source !== undefined) {
      applySource(result, source as Record<PropertyKey, unknown>);
    }
  }
  return result;
}

/**
 * @deprecated Use {@link mergeDeep} instead. Will be removed in v3.
 * @since 1.9.0
 * @example
 * deepMerge({ a: 1, b: { c: 2 } }, { b: { d: 3 }, e: 4 })
 * // => { a: 1, b: { c: 2, d: 3 }, e: 4 }
 *
 * // Later source wins for non-object values
 * deepMerge({ a: 1, arr: [1, 2] }, { a: 2, arr: [3] })
 * // => { a: 2, arr: [3] }
 *
 * // undefined never overwrites
 * deepMerge({ a: 1 }, { a: undefined })
 * // => { a: 1 }
 *
 * // Three sources, left to right
 * deepMerge({ x: 1 }, { y: 2 }, { x: 99, z: 3 })
 * // => { x: 99, y: 2, z: 3 }
 *
 * **Breaking change (v2.x):** this function previously mutated the first argument
 * in-place. It now delegates to `mergeDeep`, which returns a **new object**.
 * Read the return value — do not rely on the first argument being updated.
 *
 * The former `deepMerge(null, …)` / `deepMerge(undefined, …)` overloads that
 * returned `null` / `undefined` are also gone; `mergeDeep` always returns a
 * plain object.
 */
export { mergeDeep as deepMerge };
