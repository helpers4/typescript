/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { assertNeverScheme } from './_assertNeverScheme';
import { incrementGentoo } from './_gentoo';
import { incrementSemVer } from './_semver';
import type { IncrementType, VersionScheme } from './types';

/**
 * Increments a version, according to the given `scheme`.
 *
 * **`'semver'`** (default) — bumps `major`/`minor`/`patch` per SemVer, resetting the
 * finer-grained components (bumping `major` resets `minor` and `patch` to `0`, etc.) and
 * dropping any prerelease/build metadata.
 *
 * **`'gentoo'`** — bumps the component at `type`'s position (`major` → 1st, `minor` → 2nd,
 * `patch` → 3rd — Gentoo's `components` array can be any length, but the first three follow
 * the same positional convention as SemVer), zeroing everything after it and dropping the
 * letter/suffixes/revision.
 *
 * @param version - The version to increment
 * @param type - The increment type ('major', 'minor', 'patch')
 * @param scheme - Which version scheme to interpret `version` as. Defaults to `'semver'`.
 * @returns Incremented version string
 * @example
 * increment('1.2.3', 'patch') // '1.2.4'
 * increment('1.2.3', 'minor') // '1.3.0'
 * increment('1.2.3', 'major') // '2.0.0'
 * @example
 * increment('1.2.3_rc1', 'patch', 'gentoo') // '1.2.4' — drops the prerelease suffix
 * increment('1.2.3.4', 'minor', 'gentoo')   // '1.3.0.0' — an arbitrary 4th component still resets
 * @since 1.9.0
 */
export function increment(version: string, type: IncrementType, scheme?: VersionScheme): string;
export function increment(version: undefined, type: IncrementType, scheme?: VersionScheme): undefined;
export function increment(version: null, type: IncrementType, scheme?: VersionScheme): null;
export function increment(
  version: string | undefined | null,
  type: IncrementType,
  scheme: VersionScheme = 'semver',
): string | undefined | null {
  if (version === undefined || version === null) return version;
  switch (scheme) {
    case 'semver':
      return incrementSemVer(version, type);
    case 'gentoo':
      return incrementGentoo(version, type);
    default:
      return assertNeverScheme(scheme);
  }
}
