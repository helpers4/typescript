/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Arch Linux dependency lists (PKGBUILD(5)): `depends`, `makedepends`, `checkdepends`, `provides`,
 * `conflicts`... Internal implementation of the `'arch'` format of parseDependencies /
 * stringifyDependencies.
 *
 * Package names follow the `pkgname` rule of PKGBUILD(5): ASCII letters, numbers and `@ . _ + -`,
 * not starting with a hyphen or a dot. A version is `[epoch:]pkgver[-pkgrel]`, kept as written; it
 * must start with a letter or a number and may contain letters, numbers and `. _ + ~ : @ -`.
 * `optdepends` descriptions (`name: reason`) are refused: only the names part is supported.
 */

import type { ArchDependency, ComparisonOperator, DependencyGroup } from './types';

const NAME_RE = /[A-Za-z0-9@_+][A-Za-z0-9@._+-]*/y;
// The two-character operators come first so that `>=` is never read as `>` followed by `=`.
const OPERATOR_RE = /<=|>=|<|>|=/y;
const VERSION_RE = /[A-Za-z0-9][A-Za-z0-9._+~:@-]*/y;
const WHITESPACE_RE = /\s/;

function parseEntry(text: string, field: string): ArchDependency {
  const fail = (reason: string): never => {
    throw new SyntaxError(`parseDependencies: ${reason} in "${text}" (field "${field}")`);
  };
  if (text.includes(': ') || text.endsWith(':')) {
    return fail('optdepends descriptions ("name: description") are not supported');
  }
  if (WHITESPACE_RE.test(text)) {
    return fail('whitespace inside an entry (no space is allowed around a version operator)');
  }

  NAME_RE.lastIndex = 0;
  const nameMatch = NAME_RE.exec(text);
  if (!nameMatch) {
    return fail(/^[<>=]/.test(text)
      ? 'a version operator must follow the package name without a space'
      : 'expected a package name');
  }
  const dependency: ArchDependency = { name: nameMatch[0] };
  let position = NAME_RE.lastIndex;
  if (position === text.length) return dependency;

  OPERATOR_RE.lastIndex = position;
  const operatorMatch = OPERATOR_RE.exec(text);
  if (!operatorMatch) return fail(`unexpected "${text.slice(position)}"`);
  const operator = operatorMatch[0] as ComparisonOperator;
  position = OPERATOR_RE.lastIndex;
  if (position === text.length) {
    return fail(`empty version after "${operator}" (no space is allowed around a version operator)`);
  }

  VERSION_RE.lastIndex = position;
  const versionMatch = VERSION_RE.exec(text);
  if (!versionMatch) return fail(`invalid version "${text.slice(position)}"`);
  position = VERSION_RE.lastIndex;
  if (position < text.length) return fail(`unexpected "${text.slice(position)}"`);
  dependency.version = { operator, version: versionMatch[0] };
  return dependency;
}

/**
 * Parses an Arch dependency list, bare or written as a PKGBUILD array.
 * @ignore
 */
export function parseArch(field: string): DependencyGroup<ArchDependency>[] {
  const groups: DependencyGroup<ArchDependency>[] = [];
  const fail = (reason: string, text: string): never => {
    throw new SyntaxError(`parseDependencies: ${reason} in "${text}" (field "${field}")`);
  };
  let state: 'bare' | 'open' | 'closed' = 'bare';
  let position = 0;
  while (position < field.length) {
    const char = field[position]!;
    if (WHITESPACE_RE.test(char)) {
      position++;
    } else if (char === '#' && state !== 'bare') {
      const end = field.indexOf('\n', position);
      position = end === -1 ? field.length : end + 1;
    } else if (state === 'closed') {
      return fail('unexpected text after the closing parenthesis', field.slice(position));
    } else if (char === '(') {
      if (state === 'open' || groups.length > 0) return fail('unexpected "("', field.slice(position));
      state = 'open';
      position++;
    } else if (char === ')') {
      if (state !== 'open') return fail('unbalanced parenthesis: unexpected ")"', field.slice(position));
      state = 'closed';
      position++;
    } else if (char === "'" || char === '"') {
      const end = field.indexOf(char, position + 1);
      if (end === -1) return fail('unterminated quote', field.slice(position));
      const next = field[end + 1];
      if (next !== undefined && next !== ')' && !WHITESPACE_RE.test(next)) {
        return fail('unexpected text after a quoted entry', field.slice(position));
      }
      groups.push([parseEntry(field.slice(position + 1, end), field)]);
      position = end + 1;
    } else {
      let end = position;
      while (end < field.length && field[end] !== ')' && !WHITESPACE_RE.test(field[end]!)) end++;
      groups.push([parseEntry(field.slice(position, end), field)]);
      position = end;
    }
  }
  if (state === 'open') fail('unbalanced parenthesis: missing ")"', '(');
  return groups;
}

/** @ignore */
export function stringifyArch(groups: readonly DependencyGroup<ArchDependency>[]): string {
  const entries: string[] = [];
  for (const group of groups) {
    if (group.length > 1) {
      throw new RangeError(`stringifyDependencies: the 'arch' format has no alternatives (a group has ${group.length})`);
    }
    for (const { name, version } of group) {
      entries.push(version ? `${name}${version.operator}${version.version}` : name);
    }
  }
  return entries.join(' ');
}
