/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { UNKNOWN_FAMILY } from './_unknownFamily';
import { families } from './families';

/**
 * Whether two raw license strings agree closely enough to count as "no real conflict" — true
 * when their family sets share at least one real (known) family, or when either side is entirely
 * unknown (e.g. `"custom"`/`"unknown"`) — a vague claim is never itself evidence of disagreement.
 * Only two *different*, both-known family sets (e.g. `bsd` vs `apache`) count as a real conflict.
 * @param a - The first raw license string
 * @param b - The second raw license string
 * @returns `true` when the two strings can be treated as the same license (or too vague to tell), `false` on a real family conflict
 * @example
 * agree('GPL3', 'GPL-3.0-or-later')
 * // => true
 * @example
 * agree('BSD-2-Clause', 'Apache-2.0')
 * // => false
 * @example
 * agree('custom', 'MIT')
 * // => true (a vague claim is never itself a conflict)
 * @since 3.1.2
 */
export function agree(a: string, b: string): boolean {
  const knownA = new Set([...families(a)].filter((f) => f !== UNKNOWN_FAMILY));
  const knownB = new Set([...families(b)].filter((f) => f !== UNKNOWN_FAMILY));

  if (knownA.size === 0 || knownB.size === 0) return true;
  for (const family of knownA) if (knownB.has(family)) return true;
  return false;
}
