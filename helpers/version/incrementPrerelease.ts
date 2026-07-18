/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parse } from './parse';
import { stringify } from './stringify';

/**
 * Increments the prerelease portion of a semantic version — the semantics `npm version
 * prerelease --preid <id>` uses, not covered by {@link increment} (which only handles
 * `'major' | 'minor' | 'patch'`).
 *
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
 * @param version - The version to increment
 * @param prereleaseId - The prerelease type/identifier (e.g. `'alpha'`, `'beta'`, `'rc'`)
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
 * @since next
 */
export function incrementPrerelease(version: string, prereleaseId: string): string;
export function incrementPrerelease(version: undefined, prereleaseId: string): undefined;
export function incrementPrerelease(version: null, prereleaseId: string): null;
export function incrementPrerelease(
  version: string | undefined | null,
  prereleaseId: string
): string | undefined | null {
  if (version === undefined || version === null) return version;

  const hasV = version.startsWith('v');
  const parsed = parse(version);
  const [currentId, currentNum] = parsed.prerelease;

  // Only increment counter if: same prerelease ID, currentNum is a non-empty string, and is a finite number
  // Otherwise, reset counter to 0 (handles non-numeric, empty, null, or different prerelease ID)
  const shouldIncrement =
    currentId === prereleaseId &&
    typeof currentNum === 'string' &&
    currentNum !== '' &&
    Number.isFinite(Number(currentNum));

  const result =
    parsed.prerelease.length === 0
      ? stringify({ ...parsed, patch: parsed.patch + 1, prerelease: [prereleaseId, '0'], build: [] })
      : stringify({
          ...parsed,
          prerelease: [
            prereleaseId,
            shouldIncrement ? String(Number(currentNum) + 1) : '0',
          ],
          build: [],
        });

  return hasV ? `v${result}` : result;
}
