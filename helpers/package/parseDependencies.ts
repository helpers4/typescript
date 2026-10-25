/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parseAlpine } from './_alpine';
import { parseArch } from './_arch';
import { parseDebian } from './_debian';
import { parsePep508 } from './_pep508';
import { parseRpm } from './_rpm';
import type { DebianDependencyOptions, DependencyFormat, DependencyGroup, DependencyOf, ParseDependenciesOptions } from './types';

/**
 * Parses the value of a package dependency field (`Depends`, `Requires`, `depends`, ...) into a
 * structure: groups of alternatives, each alternative a name with an optional version constraint.
 * `format` says how the text is written, and decides the exact shape of each dependency and the
 * operator spellings (see {@link DependencyFormats}); the options are those of that format only.
 *
 * **`'debian'`** — a relationship field of the Debian Policy Manual, chapter 7.1 (`Depends`,
 * `Pre-Depends`, `Recommends`, `Suggests`, `Enhances`, `Breaks`, `Conflicts`, `Provides`,
 * `Replaces`, `Build-Depends`, ...). Commas separate the entries that must all hold (AND), `|`
 * separates the alternatives inside an entry (OR). Each alternative is
 * `name[:arch] [(op version)] [[archs]] [<profiles>]`, in that order, with any whitespace (line
 * breaks included, as in a multi-line `Depends`) between the parts. The operators are Debian's
 * `<<`, `<=`, `=`, `>=` and `>>`, kept as written; the obsolete `<` and `>` throw unless
 * `options.compat` is set, in which case they are read as `<=` and `>=` like dpkg does.
 * Whitespace-only entries (a trailing comma, `a,, b`) are skipped, as dpkg does. The
 * `${substvars}` of source `debian/control` files are not supported.
 *
 * **`'rpm'`** — an RPM `Requires` value: capabilities separated by commas and/or whitespace, each
 * `name [op version]` with `<`, `<=`, `=`, `>=` or `>`; boolean dependencies `(a or b)` give the
 * alternatives of a group.
 *
 * **`'arch'`** — an Arch Linux `depends` array or `.PKGINFO` list: entries separated by whitespace
 * (quotes and surrounding parentheses of a PKGBUILD array are accepted), each `name[op version]`.
 *
 * **`'alpine'`** — an Alpine `depends` list: entries separated by whitespace, each
 * `[!]name[op version]` (`!` is a conflict).
 *
 * **`'pep508'`** — PEP 508 requirements, one per line (as in `requirements.txt` or the
 * `dependencies` of a `pyproject.toml`): `name[extras] specifiers ; marker`, or `name @ url`.
 *
 * Every entry that is not valid throws a `SyntaxError` quoting the offending text. Parsing is
 * linear in the input.
 *
 * @param field - The value of a dependency field
 * @param format - How the field is written
 * @param options - The options of `format`, if it has any
 * @returns One group of alternatives per entry
 * @throws {SyntaxError} When an entry is not valid
 * @throws {RangeError} For a `format` that is not supported
 *
 * @example
 * ```ts
 * parseDependencies('libc6 (>= 2.34), python3:any | python3 (>= 3.8) [amd64], foo <!nocheck>', 'debian');
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
export function parseDependencies<Format extends DependencyFormat>(
  field: string,
  format: Format,
  ...options: ParseDependenciesOptions<Format>
): DependencyGroup<DependencyOf<Format>>[] {
  const parsed: unknown = parseFormat(field, format, options[0] as DebianDependencyOptions | undefined);
  return parsed as DependencyGroup<DependencyOf<Format>>[];
}

function parseFormat(field: string, format: DependencyFormat, options: DebianDependencyOptions | undefined): unknown {
  switch (format) {
    case 'debian':
      return parseDebian(field, options?.compat === true);
    case 'rpm':
      return parseRpm(field);
    case 'arch':
      return parseArch(field);
    case 'alpine':
      return parseAlpine(field);
    case 'pep508':
      return parsePep508(field);
    default:
      throw new RangeError(`parseDependencies: unsupported format "${String(format)}"`);
  }
}
