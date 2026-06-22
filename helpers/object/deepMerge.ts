/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { mergeDeep } from './mergeDeep.js';

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
 * Own enumerable string and symbol keys are processed; inherited and non-enumerable
 * properties are skipped. Prototype-polluting keys (`__proto__`, `constructor`,
 * `prototype`) are silently ignored.
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
 * @deprecated Use {@link mergeDeep} instead. Will be removed in v3.
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
