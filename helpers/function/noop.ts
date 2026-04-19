/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * A no-operation function that does nothing and returns `undefined`
 *
 * Useful as a default callback, placeholder, or to explicitly ignore a value.
 *
 * @returns Nothing (`undefined`)
 * @example
 * ```ts
 * const onComplete = options.callback ?? noop;
 * onComplete();
 * ```
 * @since 2.0.0
 */
export function noop(): void {
  return;
}
