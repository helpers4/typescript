/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a value is a `SharedArrayBuffer` instance.
 *
 * `SharedArrayBuffer` enables shared memory between the main thread and worker
 * threads. In browsers without COOP/COEP headers, `SharedArrayBuffer` may be
 * unavailable; this function returns `false` in that case.
 *
 * @param value - The value to check
 * @returns `true` if value is a SharedArrayBuffer
 * @example
 * isSharedArrayBuffer(new SharedArrayBuffer(8)) // => true
 * isSharedArrayBuffer(new ArrayBuffer(8))       // => false
 * isSharedArrayBuffer(null)                     // => false
 * @since 2.0.3
 */
export function isSharedArrayBuffer(value: unknown): value is SharedArrayBuffer {
  return typeof SharedArrayBuffer !== 'undefined' && value instanceof SharedArrayBuffer;
}
