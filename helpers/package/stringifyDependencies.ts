/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { Dependency, DependencyFormat, DependencyGroup } from './parseDependencies';

function stringifyDebianAlternative(relationship: Dependency): string {
  let text = relationship.arch === undefined ? relationship.name : `${relationship.name}:${relationship.arch}`;
  if (relationship.version) text += ` (${relationship.version.operator} ${relationship.version.version})`;
  if (relationship.architectures?.length) text += ` [${relationship.architectures.join(' ')}]`;
  for (const profile of relationship.profiles ?? []) text += ` <${profile.join(' ')}>`;
  return text;
}

/**
 * Writes dependency groups back as a field value, the inverse of {@link parseDependencies}.
 *
 * **`'debian'`** — the canonical spacing of the Debian Policy Manual 7.1: `, ` between entries,
 * ` | ` between alternatives, a space before each `(op version)`, `[archs]` and `<profiles>`, and
 * the operators as they are (`<<`, `<=`, `=`, `>=`, `>>`). `parseDependencies(stringifyDependencies(groups))`
 * gives `groups` back, and stringifying a parsed field normalises its whitespace.
 *
 * An empty `architectures` list is left out (an empty `[]` is not valid in a field), and an empty
 * group writes nothing, so it does not survive a round trip.
 *
 * @param groups - The groups of alternatives, as returned by `parseDependencies`
 * @param format - How to write the field. Defaults to `'debian'`.
 * @returns The field value on one line; `''` for `[]`
 * @throws {RangeError} For a `format` that is not supported
 *
 * @example
 * ```ts
 * stringifyDependencies([
 *   [{ name: 'libc6', version: { operator: '>=', version: '2.34' } }],
 *   [{ name: 'python3', arch: 'any' }, { name: 'python3' }],
 * ]);
 * // 'libc6 (>= 2.34), python3:any | python3'
 * ```
 *
 * @since next
 */
export function stringifyDependencies(groups: readonly DependencyGroup[], format: DependencyFormat = 'debian'): string {
  if (format !== 'debian') throw new RangeError(`stringifyDependencies: unsupported format "${String(format)}"`);
  return groups.map((group) => group.map(stringifyDebianAlternative).join(' | ')).join(', ');
}
