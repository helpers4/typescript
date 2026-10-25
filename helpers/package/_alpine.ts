/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Alpine (apk) dependencies: the `depends` of an APKBUILD, the dependencies of an apk package and
 * the lines of `/etc/apk/world`, all written `[!]name[op version]` and separated by whitespace.
 * Internal implementation of the `'alpine'` format of parseDependencies / stringifyDependencies.
 *
 * Reference: apk-tools `apk_dep_parse` (src/package.c) and `apk_version_op_string` (src/version.c),
 * apk-world(5).
 */

import type { AlpineDependency, AlpineOperator, DependencyGroup } from './types';

/**
 * The operators apk-tools writes (`apk_version_op_string`): the five comparisons, the prefix match
 * `~` and its `>~` / `<~` variants, and `><`, the identity hash match.
 */
const OPERATORS: ReadonlySet<string> = new Set(['<', '<=', '=', '>=', '>', '~', '<~', '>~', '><']);

const NAME_RE = /[A-Za-z0-9_+.\-:/@[\]]+/y;
const OPERATOR_RE = /[<>=~]+/y;

function parseEntry(entry: string, field: string): AlpineDependency {
  const fail = (reason: string): never => {
    throw new SyntaxError(`parseDependencies: ${reason} in "${entry}" (field "${field}")`);
  };
  if (entry.includes('"') || entry.includes("'")) return fail('quotes are not part of the format');

  const conflict = entry.startsWith('!');
  NAME_RE.lastIndex = conflict ? 1 : 0;
  const nameMatch = NAME_RE.exec(entry);
  if (!nameMatch) return fail('expected a package name');
  const dependency: AlpineDependency = { name: nameMatch[0] };
  if (conflict) dependency.conflict = true;

  let position = NAME_RE.lastIndex;
  if (position === entry.length) return dependency;
  OPERATOR_RE.lastIndex = position;
  const operatorMatch = OPERATOR_RE.exec(entry);
  if (!operatorMatch) return fail(`unexpected "${entry.slice(position)}"`);
  const operator = operatorMatch[0];
  if (!OPERATORS.has(operator)) return fail(`unsupported operator "${operator}"`);
  position = OPERATOR_RE.lastIndex;
  const version = entry.slice(position);
  if (version === '') return fail('expected a version after the operator');
  if (/[<>]/.test(version)) return fail(`unexpected "${version}"`);
  // `AlpineOperator` must list every operator of OPERATORS.
  dependency.version = { operator: operator as AlpineOperator, version };
  return dependency;
}

/** @ignore */
export function parseAlpine(field: string): DependencyGroup<AlpineDependency>[] {
  const text = field.trim();
  if (text === '') return [];
  return text.split(/\s+/).map((entry) => [parseEntry(entry, field)]);
}

/** @ignore */
export function stringifyAlpine(groups: readonly DependencyGroup<AlpineDependency>[]): string {
  const entries: string[] = [];
  for (const group of groups) {
    if (group.length > 1) {
      throw new RangeError(`stringifyDependencies: the 'alpine' format has no alternatives, got ${group.length} in one group`);
    }
    for (const { name, version, conflict } of group) {
      entries.push(`${conflict ? '!' : ''}${name}${version ? `${version.operator}${version.version}` : ''}`);
    }
  }
  return entries.join(' ');
}
