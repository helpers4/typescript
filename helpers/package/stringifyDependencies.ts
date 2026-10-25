/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { stringifyAlpine } from './_alpine';
import { stringifyArch } from './_arch';
import { stringifyDebian } from './_debian';
import { stringifyPep508 } from './_pep508';
import { stringifyRpm } from './_rpm';
import type {
  AlpineDependency,
  ArchDependency,
  DebianDependency,
  DependencyFormat,
  DependencyGroup,
  DependencyOf,
  Pep508Dependency,
  RpmDependency,
} from './types';

/**
 * Writes dependency groups back as a field value, the inverse of {@link parseDependencies}; the
 * type of `groups` is that of `format`.
 *
 * **`'debian'`** — the canonical spacing of the Debian Policy Manual 7.1: `, ` between entries,
 * ` | ` between alternatives, a space before each `(op version)`, `[archs]` and `<profiles>`.
 * **`'rpm'`** — `, ` between entries, `name op version`, and `(a or b)` for alternatives.
 * **`'arch'`** — entries separated by a space, `name>=version`. **`'alpine'`** — the same, with a
 * leading `!` for a conflict. **`'pep508'`** — one requirement per line,
 * `name[extras]>=1,<2 ; marker`. The formats without alternatives (`'arch'`, `'alpine'`,
 * `'pep508'`) throw a `RangeError` for a group of several.
 *
 * `parseDependencies(stringifyDependencies(groups, f), f)` gives `groups` back, and stringifying a
 * parsed field normalises its whitespace. An empty group writes nothing, so it does not survive a
 * round trip.
 *
 * @param groups - The groups of alternatives, as returned by `parseDependencies`
 * @param format - How to write the field
 * @returns The field value; `''` for `[]`
 * @throws {RangeError} For a `format` that is not supported, or a group the format cannot express
 *
 * @example
 * ```ts
 * stringifyDependencies([
 *   [{ name: 'libc6', version: { operator: '>=', version: '2.34' } }],
 *   [{ name: 'python3', arch: 'any' }, { name: 'python3' }],
 * ], 'debian');
 * // 'libc6 (>= 2.34), python3:any | python3'
 * ```
 *
 * @since next
 */
export function stringifyDependencies<Format extends DependencyFormat>(
  groups: readonly DependencyGroup<DependencyOf<NoInfer<Format>>>[],
  format: Format,
): string {
  switch (format as DependencyFormat) {
    case 'debian':
      return stringifyDebian(groups as readonly DependencyGroup<DebianDependency>[]);
    case 'rpm':
      return stringifyRpm(groups as readonly DependencyGroup<RpmDependency>[]);
    case 'arch':
      return stringifyArch(groups as readonly DependencyGroup<ArchDependency>[]);
    case 'alpine':
      return stringifyAlpine(groups as readonly DependencyGroup<AlpineDependency>[]);
    case 'pep508':
      return stringifyPep508(groups as readonly DependencyGroup<Pep508Dependency>[]);
    default:
      throw new RangeError(`stringifyDependencies: unsupported format "${String(format)}"`);
  }
}
