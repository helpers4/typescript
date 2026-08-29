/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { assertNeverScheme } from './_assertNeverScheme';
import { incrementPrereleaseGentoo } from './_gentoo';
import { incrementPrereleaseSemVer } from './_semver';
import type { VersionScheme } from './types';

/**
 * Increments the prerelease portion of a version, according to the given `scheme` — the
 * semantics `npm version prerelease --preid <id>` uses, not covered by {@link increment} (which
 * only handles `'major' | 'minor' | 'patch'`).
 *
 * **`'semver'`** (default):
 * - No current prerelease (a release version) → bumps `patch` and starts a new prerelease line
 *   at `<prereleaseId>.0` (a prerelease of the version itself, e.g. `1.2.3`, would already be
 *   released).
 * - Same prerelease type as the current version → increments its counter.
 * - Different prerelease type (e.g. `alpha` → `beta`) → resets the counter to `0`.
 *
 * Input prerelease can be any shape, but only the first two parts are considered;
 * output is always normalized to `<prereleaseId>.<number>`. Build metadata, if any, is
 * dropped — it's tied to the specific build that produced the input version, not the new one.
 * A leading `v` is preserved if present, matching {@link increment}'s behavior (`parse`/
 * `stringify` alone would strip it — see their docs).
 *
 * **`'gentoo'`** — the same rules, but `prereleaseId` must be one of the five real Gentoo
 * suffix types (`alpha`/`beta`/`pre`/`rc`/`p`), not a free-form string — Portage's suffix
 * vocabulary is fixed by spec, unlike SemVer's arbitrary prerelease identifiers. No current
 * prerelease suffix bumps the last numeric component instead of specifically `patch`, since
 * Gentoo's `components` array can be any length.
 *
 * @param version - The version to increment
 * @param prereleaseId - The prerelease type/identifier (e.g. `'alpha'`, `'beta'`, `'rc'`)
 * @param scheme - Which version scheme to interpret `version` as. Defaults to `'semver'`.
 * @returns The version with an incremented or newly-started prerelease
 * @see {@link increment} for major/minor/patch increments
 * @example
 * incrementPrerelease('1.2.3', 'alpha')
 * // => '1.2.4-alpha.0'
 * @example
 * incrementPrerelease('1.2.4-alpha.0', 'alpha')
 * // => '1.2.4-alpha.1'
 * @example
 * incrementPrerelease('v1.2.4-alpha.3', 'beta')
 * // => 'v1.2.4-beta.0'
 * @example
 * incrementPrerelease('1.2.3', 'alpha', 'gentoo')       // => '1.2.4_alpha'
 * incrementPrerelease('1.2.3_alpha', 'alpha', 'gentoo')  // => '1.2.3_alpha1'
 * @since 3.0.1
 */
export function incrementPrerelease(version: string, prereleaseId: string, scheme?: VersionScheme): string;
export function incrementPrerelease(version: undefined, prereleaseId: string, scheme?: VersionScheme): undefined;
export function incrementPrerelease(version: null, prereleaseId: string, scheme?: VersionScheme): null;
export function incrementPrerelease(
  version: string | undefined | null,
  prereleaseId: string,
  scheme: VersionScheme = 'semver',
): string | undefined | null {
  if (version === undefined || version === null) return version;
  switch (scheme) {
    case 'semver':
      return incrementPrereleaseSemVer(version, prereleaseId);
    case 'gentoo':
      return incrementPrereleaseGentoo(version, prereleaseId);
    default:
      return assertNeverScheme(scheme);
  }
}
