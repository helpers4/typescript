/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { Relationship, RelationshipGroup } from './parseRelationships';

function stringifyAlternative(relationship: Relationship): string {
  let text = relationship.arch === undefined ? relationship.name : `${relationship.name}:${relationship.arch}`;
  if (relationship.version) text += ` (${relationship.version.operator} ${relationship.version.version})`;
  if (relationship.architectures?.length) text += ` [${relationship.architectures.join(' ')}]`;
  for (const profile of relationship.profiles ?? []) text += ` <${profile.join(' ')}>`;
  return text;
}

/**
 * Writes relationship groups back as a field value, in the canonical spacing of the Debian
 * Policy Manual 7.1: `, ` between entries, ` | ` between alternatives, and a space before each
 * `(op version)`, `[archs]` and `<profiles>`. It is the inverse of `parseRelationships`:
 * `parseRelationships(stringifyRelationships(groups))` gives `groups` back, and stringifying a
 * parsed field normalises its whitespace.
 *
 * An empty `architectures` list is left out (an empty `[]` is not valid in a field), and an empty
 * group writes nothing, so it does not survive a round trip.
 *
 * @param groups - The groups of alternatives, as returned by `parseRelationships`
 * @returns The field value on one line; `''` for `[]`
 *
 * @example
 * ```ts
 * stringifyRelationships([
 *   [{ name: 'libc6', version: { operator: '>=', version: '2.34' } }],
 *   [{ name: 'python3', arch: 'any' }, { name: 'python3' }],
 * ]);
 * // 'libc6 (>= 2.34), python3:any | python3'
 * ```
 *
 * @since next
 */
export function stringifyRelationships(groups: readonly RelationshipGroup[]): string {
  return groups.map((group) => group.map(stringifyAlternative).join(' | ')).join(', ');
}
