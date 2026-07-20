/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks whether the code is currently running in a Node.js-like environment
 * (`process.versions.node` is defined — also true in Electron's Node context).
 *
 * Note: some hybrid test environments (e.g. happy-dom, jsdom) define both `window` and Node's
 * `process` at the same time — this only reports on `process.versions.node`'s presence, it does
 * not imply `isBrowser` is false. Use both together if you need to distinguish plain Node.js
 * from a DOM-emulating Node test environment.
 * @returns `true` if `process.versions.node` is defined
 * @example
 * isNode() // => true in Node.js, false in a real browser
 * @since 3.0.3
 */
export function isNode(): boolean {
  return typeof process !== 'undefined' && typeof process.versions?.node === 'string';
}
