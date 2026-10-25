/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * The formats of dependency fields {@link parseDependencies} reads. Only `'debian'` for now (the
 * `Depends` syntax of Debian Policy 7.1); the model below is meant to take others (RPM `Requires`,
 * Arch `depends`) without changing.
 * @since next
 */
export type DependencyFormat = 'debian';

/**
 * The comparison operators of a version constraint, as the format writes them. For `'debian'`
 * (the only format for now) these are the five of Debian Policy 7.1: `<<` (strictly earlier), `<=`,
 * `=`, `>=` and `>>` (strictly later). A format with other spellings adds its own to this union.
 * @since next
 */
export type DependencyOperator = '<<' | '<=' | '=' | '>=' | '>>';

/**
 * How to read a dependency field, besides its format.
 * @since next
 */
export interface DependencyOptions {
  /**
   * `'debian'` only. Also accept the obsolete `<` and `>` operators that old packages still carry,
   * and read them as dpkg does, `<=` and `>=` (Policy forbids them because they look like the
   * opposite). Off by default: they throw a `SyntaxError`, like `satisfiesRange(..., 'debian')`
   * from `@helpers4/version` does.
   */
  compat?: boolean;
}

/**
 * A version constraint, the `(>= 2.34)` of `libc6 (>= 2.34)`.
 * @since next
 */
export interface DependencyVersion {
  /** The comparison operator. */
  operator: DependencyOperator;
  /** The version, as written; not validated (compare it with `compare(a, b, 'debian')` from `@helpers4/version`). */
  version: string;
}

/**
 * One package reference of a dependency field: a name, and what the format lets you say about it.
 * @since next
 */
export interface Dependency {
  /** The package name. */
  name: string;
  /** The version constraint. */
  version?: DependencyVersion;
  /** Debian only. The architecture qualifier after a colon (`any`, `native`, `amd64`), as in `python3:any`. */
  arch?: string;
  /** Debian only. The architecture restriction `[amd64 !i386]`, as the list `['amd64', '!i386']` (negations keep their `!`). */
  architectures?: string[];
  /**
   * Debian only. The build profile restriction. Each `<...>` is one inner list (its terms are
   * AND-ed, a `!` negates a profile), and the lists are OR-ed: `<!nocheck> <cross>` is
   * `[['!nocheck'], ['cross']]`.
   */
  profiles?: string[][];
}

/**
 * A comma-separated entry of a dependency field: the alternatives (`a | b`) that satisfy it.
 * @since next
 */
export type DependencyGroup = Dependency[];

/** The obsolete operators and what dpkg reads them as. */
const OBSOLETE_OPERATORS: Record<string, DependencyOperator> = { '<': '<=', '>': '>=' };

const NAME_RE = /[A-Za-z0-9][A-Za-z0-9+.-]*(?::[A-Za-z0-9-]+)?/y;
const VERSION_RE = /\s*\(\s*(<<|<=|>=|>>|=|<|>)\s*([^\s()<>=][^\s()]*)\s*\)/y;
const ARCHITECTURES_RE = /\s*\[([^[\]<>]*)\]/y;
const PROFILE_RE = /\s*<([^<>]*)>/y;
const SPACE_RE = /\s*/y;

function terms(text: string): string[] {
  return text.trim().split(/\s+/);
}

function parseDebianAlternative(source: string, field: string, compat: boolean): Dependency {
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
  const dependency: Dependency = { name };
  if (arch !== undefined) dependency.arch = arch;

  const versionMatch = take(VERSION_RE);
  if (versionMatch) {
    const written = versionMatch[1]!;
    if (written in OBSOLETE_OPERATORS && !compat) {
      fail(`the obsolete operator "${written}" is not allowed (use "${written}${written}" or "${written}=", or pass { compat: true })`);
    }
    dependency.version = { operator: OBSOLETE_OPERATORS[written] ?? (written as DependencyOperator), version: versionMatch[2]! };
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
 * Parses the value of a package dependency field (`Depends`, `Recommends`, `Conflicts`, ...) into a
 * format-independent structure: `format` says how the text is written (and which operator
 * spellings are valid), the result has the same shape whatever it was. Only `'debian'` is supported for now.
 *
 * **`'debian'`** — a relationship field of the Debian Policy Manual, chapter 7.1 (`Depends`,
 * `Pre-Depends`, `Recommends`, `Suggests`, `Enhances`, `Breaks`, `Conflicts`, `Provides`,
 * `Replaces`, `Build-Depends`, ...). Commas separate the entries that must all hold (AND), `|`
 * separates the alternatives inside an entry (OR). Each alternative is
 * `name[:arch] [(op version)] [[archs]] [<profiles>]`, in that order, with any whitespace (line
 * breaks included, as in a multi-line `Depends`) between the parts. The operators are Debian's
 * `<<`, `<=`, `=`, `>=` and `>>`, kept as written; the obsolete `<` and `>` throw unless
 * `options.compat` is set, in which case they are read as `<=` and `>=` like dpkg does. Compare
 * versions with `compare(a, b, 'debian')` from `@helpers4/version`.
 *
 * Whitespace-only entries (a trailing comma, `a,, b`) are skipped, as dpkg does, so an empty or
 * blank field gives `[]`. Anything else that is not valid throws a `SyntaxError` quoting the
 * offending alternative: an empty alternative (`a |`), a missing or malformed name, an unbalanced
 * parenthesis or bracket, an unknown operator, a part out of order, and the `${substvars}` of
 * source `debian/control` files. Parsing is linear in the input.
 *
 * @param field - The value of a dependency field
 * @param format - How the field is written. Defaults to `'debian'`.
 * @param options - Leniency, see {@link DependencyOptions}
 * @returns One group of alternatives per comma-separated entry
 * @throws {SyntaxError} When an alternative is not valid
 * @throws {RangeError} For a `format` that is not supported
 *
 * @example
 * ```ts
 * parseDependencies('libc6 (>= 2.34), python3:any | python3 (>= 3.8) [amd64], foo <!nocheck>');
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
export function parseDependencies(field: string, format: DependencyFormat = 'debian', options: DependencyOptions = {}): DependencyGroup[] {
  if (format !== 'debian') throw new RangeError(`parseDependencies: unsupported format "${String(format)}"`);
  const groups: DependencyGroup[] = [];
  for (const entry of field.split(',')) {
    if (entry.trim() === '') continue;
    groups.push(entry.split('|').map((alternative) => parseDebianAlternative(alternative, field, options.compat === true)));
  }
  return groups;
}
