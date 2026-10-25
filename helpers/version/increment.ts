/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { assertNeverScheme } from './_assertNeverScheme';
import { incrementDebian } from './_debian';
import { incrementGentoo } from './_gentoo';
import { incrementMaven } from './_maven';
import { incrementPacman } from './_pacman';
import { incrementPep440 } from './_pep440';
import { incrementRpm } from './_rpm';
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
 * **`'debian'`** — throws: a Debian upstream version is free-form, with no major/minor/patch
 * structure to bump.
 *
 * **`'rpm'`**, **`'pacman'`** — throw: the version is free-form, with no major/minor/patch
 * structure to bump.
 *
 * **`'pep440'`** — bumps the release component at `type`'s position (padding it with zeros up to
 * there), zeroing everything after it and dropping the pre/post/dev/local parts; the epoch is kept.
 *
 * **`'maven'`** — bumps the leading number at `type`'s position (padding with zeros), zeroing the
 * numbers after it and dropping every qualifier.
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
 * @example
 * increment('1.2.3rc1.dev2', 'minor', 'pep440') // '1.3.0'
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
    case 'debian':
      return incrementDebian();
    case 'rpm':
      return incrementRpm();
    case 'pacman':
      return incrementPacman();
    case 'pep440':
      return incrementPep440(version, type);
    case 'maven':
      return incrementMaven(version, type);
    default:
      return assertNeverScheme(scheme);
  }
}
