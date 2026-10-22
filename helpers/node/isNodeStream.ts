/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a Node.js stream (has a `.pipe()` method).
 *
 * Uses duck-typing: any object with a `pipe` function qualifies, covering
 * `Readable`, `Writable`, `Duplex`, `Transform`, and custom stream-compatible
 * objects without importing from `node:stream`.
 *
 * @param value - The value to check
 * @returns `true` if value is a Node.js stream
 * @example
 * import { Readable } from 'node:stream';
 * isNodeStream(new Readable()) // => true
 * isNodeStream({})             // => false
 * isNodeStream(null)           // => false
 * @since 2.0.3
 */
export function isNodeStream(value: unknown): value is { pipe: (...args: unknown[]) => unknown } {
  return (
    // Intentionally `object`-only, unlike `isPromiseLike` (see type/isPromiseLike.ts):
    // a callable function exposing `.pipe()` would be an unusual, contrived stream shape.
    value !== null &&
    typeof value === 'object' &&
    typeof (value as Record<string, unknown>)['pipe'] === 'function'
  );
}
