/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 *
 * Internal canonical JSON serializer (RFC 8785, JSON Canonicalization Scheme) shared by
 * stringify.ts, stringifyLines.ts and stringifySequence.ts. Not exported from the package
 * barrel — tests live in _canonical.test.ts.
 */

/** A lone UTF-16 surrogate, which I-JSON (and so RFC 8785) forbids in strings and keys. @ignore */
const LONE_SURROGATE = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/;

/** @ignore */
function serializeString(value: string): string {
  if (LONE_SURROGATE.test(value)) {
    throw new RangeError(`stringify: canonical JSON can't hold a string with a lone surrogate: ${JSON.stringify(value)}`);
  }
  return JSON.stringify(value);
}

/**
 * Serializes `holder[key]` the way `JSON.stringify` would — same `toJSON` calls, same
 * unwrapping of `Number`/`String`/`Boolean` objects, same dropping of `undefined`, functions and
 * symbols — but with the RFC 8785 rules on top: object keys sorted by UTF-16 code units, no
 * whitespace, and an error instead of a silent `null` for `NaN`/`Infinity`. Numbers already
 * follow the RFC as is: it reuses ECMAScript's own number-to-string algorithm.
 *
 * Returns `undefined` for a value `JSON.stringify` would skip (so an object member is dropped
 * and an array item becomes `null`, as it would there).
 * @ignore
 */
function serialize(holder: Record<string, unknown>, key: string, ancestors: unknown[]): string | undefined {
  let value: unknown = holder[key];
  if ((typeof value === 'object' && value !== null) || typeof value === 'bigint') {
    const toJSON = (value as { toJSON?: unknown }).toJSON;
    if (typeof toJSON === 'function') value = toJSON.call(value, key);
  }
  if (typeof value === 'object' && value !== null) {
    // Realm-safe check for a Number/String/Boolean wrapper object, which JSON.stringify unwraps.
    const tag = Object.prototype.toString.call(value);
    if (tag === '[object Number]') value = Number(value);
    else if (tag === '[object String]') value = String(value);
    else if (tag === '[object Boolean]') value = Boolean.prototype.valueOf.call(value);
  }

  switch (typeof value) {
    case 'boolean':
      return String(value);
    case 'number':
      if (!Number.isFinite(value)) {
        throw new RangeError(`stringify: canonical JSON can't hold ${value}`);
      }
      return JSON.stringify(value);
    case 'string':
      return serializeString(value);
    case 'bigint':
      throw new TypeError('stringify: a BigInt has no JSON representation');
    case 'object':
      break;
    default:
      // undefined, function, symbol
      return undefined;
  }
  if (value === null) return 'null';

  if (ancestors.includes(value)) {
    throw new TypeError('stringify: converting a circular structure to JSON');
  }
  ancestors.push(value);
  let result: string;
  if (Array.isArray(value)) {
    const items = value as unknown as Record<string, unknown>;
    result = `[${value.map((_, index) => serialize(items, String(index), ancestors) ?? 'null').join(',')}]`;
  } else {
    const object = value as Record<string, unknown>;
    const members: string[] = [];
    for (const member of Object.keys(object).toSorted()) {
      const serialized = serialize(object, member, ancestors);
      if (serialized !== undefined) members.push(`${serializeString(member)}:${serialized}`);
    }
    result = `{${members.join(',')}}`;
  }
  ancestors.pop();
  return result;
}

/**
 * Serializes `value` as canonical JSON (RFC 8785), or returns `undefined` when `JSON.stringify`
 * would (a top-level `undefined`, function or symbol).
 * @ignore
 */
export function stringifyCanonical(value: unknown): string | undefined {
  return serialize({ '': value }, '', []);
}
