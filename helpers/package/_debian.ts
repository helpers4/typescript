/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Debian relationship fields (Debian Policy Manual 7.1): `Depends`, `Recommends`, `Build-Depends`...
 * Internal implementation of the `'debian'` format of parseDependencies / stringifyDependencies.
 */

import type { DebianDependency, DebianOperator, DependencyGroup } from './types';

/** The obsolete operators and what dpkg reads them as. */
const OBSOLETE_OPERATORS: Record<string, DebianOperator> = { '<': '<=', '>': '>=' };

const NAME_RE = /[A-Za-z0-9][A-Za-z0-9+.-]*(?::[A-Za-z0-9-]+)?/y;
const VERSION_RE = /\s*\(\s*(<<|<=|>=|>>|=|<|>)\s*([^\s()<>=][^\s()]*)\s*\)/y;
const ARCHITECTURES_RE = /\s*\[([^[\]<>]*)\]/y;
const PROFILE_RE = /\s*<([^<>]*)>/y;
const SPACE_RE = /\s*/y;

function terms(text: string): string[] {
  return text.trim().split(/\s+/);
}

function parseAlternative(source: string, field: string, compat: boolean): DebianDependency {
  const text = source.trim();
  let position = 0;
  const fail = (reason: string): never => {
    throw new SyntaxError(`parseDependencies: ${reason} in "${text}" (field "${field}")`);
  };
  const take = (pattern: RegExp): RegExpExecArray | null => {
    pattern.lastIndex = position;
    const match = pattern.exec(text);
    if (match) position = pattern.lastIndex;
    return match;
  };

  const nameMatch = take(NAME_RE);
  if (!nameMatch) return fail('expected a package name');
  const [name, arch] = nameMatch[0].split(':') as [string, string | undefined];
  const dependency: DebianDependency = { name };
  if (arch !== undefined) dependency.arch = arch;

  const versionMatch = take(VERSION_RE);
  if (versionMatch) {
    const written = versionMatch[1]!;
    if (written in OBSOLETE_OPERATORS && !compat) {
      fail(`the obsolete operator "${written}" is not allowed (use "${written}${written}" or "${written}=", or pass { compat: true })`);
    }
    dependency.version = { operator: OBSOLETE_OPERATORS[written] ?? (written as DebianOperator), version: versionMatch[2]! };
  }

  const archMatch = take(ARCHITECTURES_RE);
  if (archMatch) {
    if (archMatch[1]!.trim() === '') fail('empty architecture restriction');
    dependency.architectures = terms(archMatch[1]!);
  }

  let profileMatch = take(PROFILE_RE);
  if (profileMatch) dependency.profiles = [];
  while (profileMatch) {
    if (profileMatch[1]!.trim() === '') fail('empty build profile restriction');
    dependency.profiles!.push(terms(profileMatch[1]!));
    profileMatch = take(PROFILE_RE);
  }

  take(SPACE_RE);
  if (position < text.length) fail(`unexpected "${text.slice(position)}"`);
  return dependency;
}

/**
 * Parses a Debian relationship field; `compat` also accepts the obsolete `<` and `>` operators.
 * @ignore
 */
export function parseDebian(field: string, compat: boolean): DependencyGroup<DebianDependency>[] {
  const groups: DependencyGroup<DebianDependency>[] = [];
  for (const entry of field.split(',')) {
    if (entry.trim() === '') continue;
    groups.push(entry.split('|').map((alternative) => parseAlternative(alternative, field, compat)));
  }
  return groups;
}

function stringifyAlternative(relationship: DebianDependency): string {
  let text = relationship.arch === undefined ? relationship.name : `${relationship.name}:${relationship.arch}`;
  if (relationship.version) text += ` (${relationship.version.operator} ${relationship.version.version})`;
  if (relationship.architectures?.length) text += ` [${relationship.architectures.join(' ')}]`;
  for (const profile of relationship.profiles ?? []) text += ` <${profile.join(' ')}>`;
  return text;
}

/** @ignore */
export function stringifyDebian(groups: readonly DependencyGroup<DebianDependency>[]): string {
  return groups.map((group) => group.map(stringifyAlternative).join(' | ')).join(', ');
}
