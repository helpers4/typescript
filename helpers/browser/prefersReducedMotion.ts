/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { matchesMedia } from './matchesMedia';

/**
 * Whether the user asked the system to reduce motion (`prefers-reduced-motion: reduce`).
 *
 * Outside a browser, it returns `false`. To react to changes, use
 * `watchMedia('(prefers-reduced-motion: reduce)', listener)`.
 *
 * @returns `true` if animations should be reduced or removed
 * @example
 * const duration = prefersReducedMotion() ? 0 : 300;
 * @since 3.1.5
 */
export function prefersReducedMotion(): boolean {
  return matchesMedia('(prefers-reduced-motion: reduce)');
}
