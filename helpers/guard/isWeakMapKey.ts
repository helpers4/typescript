/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks whether a value can be used as a key in a `WeakMap` (or a `WeakSet` member / `WeakRef`
 * target) — an object, a function (despite `typeof` reporting `'function'`, functions are
 * objects), or an *unregistered* symbol (a plain `Symbol(...)` or a well-known symbol like
 * `Symbol.iterator`).
 *
 * Symbols registered via `Symbol.for(...)` are excluded: since they live forever in the global
 * symbol registry, the language disallows them as weak references (ES2023's "Symbols as
 * WeakMap keys"). This is the part of the check easy to get wrong — `typeof value === 'symbol'`
 * alone accepts registered symbols too, which actually throw at `WeakMap.prototype.set`.
 * @param value - The value to check
 * @returns `true` if `value` is a valid `WeakMap`/`WeakSet` key or `WeakRef` target
 * @example
 * isWeakMapKey({})              // => true
 * isWeakMapKey(() => {})        // => true   (functions are objects)
 * isWeakMapKey(Symbol('x'))     // => true   (unregistered symbol)
 * isWeakMapKey(Symbol.iterator) // => true   (well-known symbol)
 * isWeakMapKey(Symbol.for('x')) // => false  (registered symbol — lives forever)
 * isWeakMapKey(null)            // => false
 * isWeakMapKey(42)              // => false
 * @since next
 */
export function isWeakMapKey(value: unknown): value is object | symbol {
  if (typeof value === 'object') return value !== null;
  if (typeof value === 'function') return true;
  if (typeof value === 'symbol') return Symbol.keyFor(value) === undefined;
  return false;
}
