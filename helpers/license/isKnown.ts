/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { UNKNOWN_FAMILY } from './_unknownFamily';
import { families } from './families';

/**
 * Whether a raw license string resolves to at least one recognized family — `false` for an
 * empty string, a purely non-informative claim (`"custom"`, `"unknown"`, `"LicenseRef-EULA"`,
 * ...), or a compound expression where every token is non-informative.
 * @param raw - The raw license string to check
 * @returns `true` if at least one token in `raw` resolves to a real family
 * @example
 * isKnown('GPL-3.0-or-later')
 * // => true
 * @example
 * isKnown('custom:Acme End User License')
 * // => false
 * @since next
 */
export function isKnown(raw: string): boolean {
  for (const family of families(raw)) {
    if (family !== UNKNOWN_FAMILY) return true;
  }
  return false;
}
