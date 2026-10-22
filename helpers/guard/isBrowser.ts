/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks whether the code is currently running in a browser-like environment
 * (`window` and `window.document` both defined).
 *
 * Note: some hybrid test environments (e.g. happy-dom, jsdom) define both `window` and Node's
 * `process` at the same time — this only reports on `window`'s presence, it does not imply
 * `isNode` is false. Use both together if you need to distinguish a real browser from a
 * DOM-emulating Node test environment.
 * @returns `true` if `window` and `window.document` are both defined
 * @example
 * isBrowser() // => true in a real browser, false in plain Node.js
 * @since 3.0.3
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined';
}
