/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * The comparison operators of a versioned relationship. `<<`, `<=`, `=`, `>=` and `>>` are the
 * ones Debian Policy 7.1 defines; the obsolete `<` and `>` (which dpkg reads as `<=` and `>=`) are
 * accepted when parsing and reported as written.
 * @since next
 */
export type RelationshipOperator = '<<' | '<=' | '=' | '>=' | '>>' | '<' | '>';

/**
 * A version constraint, the `(>= 2.34)` of `libc6 (>= 2.34)`.
 * @since next
 */
export interface RelationshipVersion {
  /** The comparison operator. */
  operator: RelationshipOperator;
  /** The version, as written; not validated (compare it with `compare(a, b, 'debian')` from `@helpers4/version`). */
  version: string;
}

/**
 * One package reference of a relationship field: `name[:arch] [(op version)] [[archs]] [<profiles>]`.
 * @since next
 */
export interface Relationship {
  /** The package name. */
  name: string;
  /** The architecture qualifier after a colon (`any`, `native`, `amd64`), as in `python3:any`. */
  arch?: string;
  /** The version constraint. */
  version?: RelationshipVersion;
  /** The architecture restriction `[amd64 !i386]`, as the list `['amd64', '!i386']` (negations keep their `!`). */
  architectures?: string[];
  /**
   * The build profile restriction. Each `<...>` is one inner list (its terms are AND-ed, a `!`
   * negates a profile), and the lists are OR-ed: `<!nocheck> <cross>` is `[['!nocheck'], ['cross']]`.
   */
  profiles?: string[][];
}

/**
 * A comma-separated entry of a relationship field: the alternatives (`a | b`) that satisfy it.
 * @since next
 */
export type RelationshipGroup = Relationship[];

const NAME_RE = /[A-Za-z0-9][A-Za-z0-9+.-]*(?::[A-Za-z0-9-]+)?/y;
const VERSION_RE = /\s*\(\s*(<<|<=|>=|>>|=|<|>)\s*([^\s()<>=][^\s()]*)\s*\)/y;
const ARCHITECTURES_RE = /\s*\[([^[\]<>]*)\]/y;
const PROFILE_RE = /\s*<([^<>]*)>/y;
const SPACE_RE = /\s*/y;

function terms(text: string): string[] {
  return text.trim().split(/\s+/);
}

function parseAlternative(source: string, field: string): Relationship {
  const text = source.trim();
  let position = 0;
  const fail = (reason: string): never => {
    throw new SyntaxError(`parseRelationships: ${reason} in "${text}" (field "${field}")`);
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
  const relationship: Relationship = { name };
  if (arch !== undefined) relationship.arch = arch;

  const versionMatch = take(VERSION_RE);
  if (versionMatch) {
    relationship.version = { operator: versionMatch[1] as RelationshipOperator, version: versionMatch[2]! };
  }

  const archMatch = take(ARCHITECTURES_RE);
  if (archMatch) {
    if (archMatch[1]!.trim() === '') fail('empty architecture restriction');
    relationship.architectures = terms(archMatch[1]!);
  }

  let profileMatch = take(PROFILE_RE);
  if (profileMatch) relationship.profiles = [];
  while (profileMatch) {
    if (profileMatch[1]!.trim() === '') fail('empty build profile restriction');
    relationship.profiles!.push(terms(profileMatch[1]!));
    profileMatch = take(PROFILE_RE);
  }

  take(SPACE_RE);
  if (position < text.length) fail(`unexpected "${text.slice(position)}"`);
  return relationship;
}

/**
 * Parses a Debian relationship field (`Depends`, `Pre-Depends`, `Recommends`, `Suggests`,
 * `Enhances`, `Breaks`, `Conflicts`, `Provides`, `Replaces`, `Build-Depends`, ...), following the
 * Debian Policy Manual, chapter 7.1 "Syntax of relationship fields".
 *
 * Commas separate the entries that must all hold (AND), `|` separates the alternatives inside an
 * entry (OR). Each alternative is `name[:arch] [(op version)] [[archs]] [<profiles>]`, in that
 * order, with any whitespace (including line breaks, as in a multi-line `Depends`) between the
 * parts. The operators are `<<`, `<=`, `=`, `>=` and `>>`; the obsolete `<` and `>` are accepted
 * and reported as written. Note that `satisfiesRange(..., 'debian')` from `@helpers4/version`
 * rejects those two and uses the same five operators otherwise; compare versions with
 * `compare(a, b, 'debian')`.
 *
 * Whitespace-only entries (a trailing comma, `a,, b`) are skipped, as dpkg does, so an empty or
 * blank field gives `[]`. Anything else that is not valid throws a `SyntaxError` quoting the
 * offending alternative: an empty alternative (`a |`), a missing or malformed name, an unbalanced
 * parenthesis or bracket, an unknown operator, a part out of order, and the `${substvars}` of
 * source `debian/control` files. Parsing is linear in the input.
 *
 * `stringifyRelationships` is the inverse.
 *
 * @param field - The value of a relationship field
 * @returns One group of alternatives per comma-separated entry
 * @throws {SyntaxError} When an alternative is not valid
 *
 * @example
 * ```ts
 * parseRelationships('libc6 (>= 2.34), python3:any | python3 (>= 3.8) [amd64], foo <!nocheck>');
 * // [
 * //   [{ name: 'libc6', version: { operator: '>=', version: '2.34' } }],
 * //   [
 * //     { name: 'python3', arch: 'any' },
 * //     { name: 'python3', version: { operator: '>=', version: '3.8' }, architectures: ['amd64'] },
 * //   ],
 * //   [{ name: 'foo', profiles: [['!nocheck']] }],
 * // ]
 * ```
 *
 * @since next
 */
export function parseRelationships(field: string): RelationshipGroup[] {
  const groups: RelationshipGroup[] = [];
  for (const entry of field.split(',')) {
    if (entry.trim() === '') continue;
    groups.push(entry.split('|').map((alternative) => parseAlternative(alternative, field)));
  }
  return groups;
}
