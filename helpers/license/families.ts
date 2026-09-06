/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { UNKNOWN_FAMILY } from './_unknownFamily';

// Longest/most specific alias keys first within a family so a substring match never lets a
// shorter, less specific alias shadow a longer one that also matches the same input.
const FAMILY_ALIASES: Record<string, readonly string[]> = {
  mit: ['mit-0', 'mit'],
  gpl: [
    'gpl-3.0-or-later', 'gpl-3.0-only', 'gpl-2.0-or-later', 'gpl-2.0-only',
    'gpl-1.0-or-later', 'gpl-3.0+', 'gpl-2.0+', 'gpl-3.0', 'gpl-2.0',
    'gplv3', 'gplv2', 'gpl3+', 'gpl3', 'gpl2', 'gpl-3', 'gpl-2', 'gpl',
  ],
  lgpl: [
    'lgpl-3.0-or-later', 'lgpl-3.0-only', 'lgpl-2.1-or-later', 'lgpl-2.1-only',
    'lgpl-2.0-or-later', 'lgpl-2.0-only', 'lgpl-3.0+', 'lgpl-2.1+', 'lgpl-3.0', 'lgpl-2.1',
    'lgplv3', 'lgplv2.1', 'lgpl3', 'lgpl2.1', 'lgpl2', 'lgpl',
  ],
  agpl: ['agpl-3.0-or-later', 'agpl-3.0-only', 'agpl-3.0', 'agplv3', 'agpl3', 'agpl'],
  bsd: [
    'bsd-3-clause', 'bsd-2-clause', '0bsd', 'bsd3', 'bsd 3-clause',
    'bsd 2-clause', 'bsd-3', 'bsd',
  ],
  apache: ['apache-2.0', 'apache license 2.0', 'apache license, version 2.0', 'apache2', 'apache 2.0', 'apache'],
  mpl: ['mpl-2.0', 'mpl2', 'mpl'],
  artistic: ['artistic-2.0', 'artistic2.0', 'perlartistic', 'artistic'],
  isc: ['isc'],
  unlicense: ['unlicense'],
  zlib: ['zlib'],
  wtfpl: ['wtfpl'],
  php: ['php'],
  epl: ['epl'],
  cc: ['cc0-1.0', 'cc0', 'cc-by-sa-4.0', 'cc-by-nc-sa-4.0', 'cc-by-sa', 'ccpl'],
  'public-domain': ['public domain'],
  boost: ['bsl-1.0', 'boost'],
  eupl: ['eupl-1.2', 'eupl'],
  postgresql: ['postgresql'],
  psf: ['psf-2.0', 'psf'],
  gfdl: ['gfdl-1.3', 'gfdl'],
  sspl: ['sspl-1.0', 'sspl'],
  busl: ['busl-1.1', 'busl'],
};

// Non-informative tokens — a real license claim was made, but it carries no comparable content
// ("custom", a bare vendor name inside `custom:<...>`/`LicenseRef-<...>`, or an explicit "we
// don't know"). Checked first, before the alias table, so e.g. "custom:MIT" reads as
// UNKNOWN_FAMILY rather than incorrectly matching MIT's alias substring — a `custom:<...>`
// convention names the *vendor's own license text*, not necessarily the SPDX license the name
// resembles.
const UNKNOWN_PATTERNS = [/^custom\b/, /^licenseref-/, /unknown/, /^none$/, /^various$/, /^unknow$/];

function matchAlias(normalized: string): string | undefined {
  for (const [family, aliases] of Object.entries(FAMILY_ALIASES)) {
    if (aliases.includes(normalized)) return family;
  }
  return undefined;
}

// Splits an SPDX-ish compound expression ("GPL-3.0+ AND LGPL-3.0+", or a lowercase "GPL-2.0+ and
// GFDL-1.3") into its individual license tokens. `WITH` exceptions ("Apache-2.0 WITH
// LLVM-exception") are dropped entirely — the exception clause never itself resembles a distinct
// license family, so it would otherwise either land in UNKNOWN_FAMILY for no reason or dilute the
// comparison with a token that isn't really a separate license claim.
function splitTokens(raw: string): string[] {
  return raw
    .split(/\s+(?:and|or)\s+/i)
    .map((token) => token.split(/\s+with\s+/i)[0].trim())
    .filter((token) => token.length > 0);
}

/**
 * Groups a raw, possibly compound license string into its coarse family set — e.g.
 * `"GPL-3.0-or-later AND LGPL-3.0-or-later"` yields `{"gpl", "lgpl"}`. Two sources reporting the
 * same real license under different notation (`"GPL3"` vs `"GPL-3.0-or-later"`, `"GPL"` vs
 * `"GPL2"`) yield the same family, so they read as agreeing rather than conflicting.
 *
 * Proprietary/custom/unknown tokens all collapse to a single shared unknown-family sentinel
 * rather than each becoming their own one-off family, so a batch of otherwise-identical
 * `"custom:<vendor>"` strings don't look like dozens of distinct disagreeing licenses. Use
 * {@link isKnown} to check whether any real (non-sentinel) family was found.
 * @param raw - A raw license string, single (`"MIT"`) or compound (`"GPL-3.0+ AND LGPL-3.0+"`)
 * @returns The set of families found; empty only when `raw` has no tokens at all (e.g. an empty string)
 * @example
 * families('GPL3')
 * // => Set(1) { 'gpl' }
 * @example
 * families('GPL-3.0-or-later AND LGPL-3.0-or-later')
 * // => Set(2) { 'gpl', 'lgpl' }
 * @example
 * families('custom:Acme End User License')
 * // => Set(1) { 'unknown' }
 * @since next
 */
export function families(raw: string): Set<string> {
  const result = new Set<string>();
  for (const token of splitTokens(raw)) {
    const normalized = token.toLowerCase();
    if (UNKNOWN_PATTERNS.some((pattern) => pattern.test(normalized))) {
      result.add(UNKNOWN_FAMILY);
      continue;
    }
    result.add(matchAlias(normalized) ?? UNKNOWN_FAMILY);
  }
  return result;
}
