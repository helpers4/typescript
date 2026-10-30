/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * A version constraint such as the `(>= 2.34)` of `libc6 (>= 2.34)`, with the operator spelled as
 * the format spells it.
 * @since 3.1.10
 */
export interface DependencyConstraint<Operator extends string = string> {
  /** The comparison operator. */
  operator: Operator;
  /** The version, as written; not validated (compare versions with `compare` from `@helpers4/version`). */
  version: string;
}

/**
 * The operators of a Debian version constraint (Debian Policy 7.1): `<<` (strictly earlier), `<=`,
 * `=`, `>=` and `>>` (strictly later).
 * @since 3.1.10
 */
export type DebianOperator = '<<' | '<=' | '=' | '>=' | '>>';

/**
 * The operators of an RPM or Arch Linux version constraint.
 * @since 3.1.10
 */
export type ComparisonOperator = '<' | '<=' | '=' | '>=' | '>';

/**
 * The operators of an Alpine (apk) version constraint, as apk writes them: the five comparisons;
 * `~`, a fuzzy match (`foo~1.2` accepts `1.2.5`), and its ordered variants `<~` and `>~`; and `><`,
 * a checksum comparison used by package indexes.
 * @since 3.1.10
 */
export type AlpineOperator = ComparisonOperator | '~' | '<~' | '>~' | '><';

/**
 * The operators of a PEP 440 version specifier, as PEP 508 requirements use them.
 * @since 3.1.10
 */
export type Pep508Operator = '~=' | '==' | '!=' | '<=' | '>=' | '<' | '>' | '===';

/**
 * One package reference of a Debian relationship field: `name[:arch] [(op version)] [[archs]] [<profiles>]`.
 * @since 3.1.10
 */
export interface DebianDependency {
  /** The package name. */
  name: string;
  /** The version constraint. */
  version?: DependencyConstraint<DebianOperator>;
  /** The architecture qualifier after a colon (`any`, `native`, `amd64`), as in `python3:any`. */
  arch?: string;
  /** The architecture restriction `[amd64 !i386]`, as the list `['amd64', '!i386']` (negations keep their `!`). */
  architectures?: string[];
  /**
   * The build profile restriction. Each `<...>` is one inner list (its terms are AND-ed, a `!`
   * negates a profile), and the lists are OR-ed: `<!nocheck> <cross>` is `[['!nocheck'], ['cross']]`.
   */
  profiles?: string[][];
}

/**
 * One package reference of an RPM `Requires` field.
 * @since 3.1.10
 */
export interface RpmDependency {
  /** The capability name: a package, a file path (`/usr/bin/perl`), `perl(Foo::Bar)`, `libfoo.so.1()(64bit)`... */
  name: string;
  /** The version constraint, e.g. `>= 1:2.0-3`. */
  version?: DependencyConstraint<ComparisonOperator>;
}

/**
 * One package reference of an Arch Linux `depends` array.
 * @since 3.1.10
 */
export interface ArchDependency {
  /** The package or provided name. */
  name: string;
  /** The version constraint, written without spaces in the source (`foo>=1.0`). */
  version?: DependencyConstraint<ComparisonOperator>;
}

/**
 * One package reference of an Alpine (apk) `depends` list.
 * @since 3.1.10
 */
export interface AlpineDependency {
  /** The package or virtual name (`so:libfoo.so.1`, `cmd:bash`, `pc:glib-2.0` included). */
  name: string;
  /** The version constraint, written without spaces in the source (`foo>=1.0`). */
  version?: DependencyConstraint<AlpineOperator>;
  /** `true` for a conflict, written with a leading `!` (`!foo`). Absent otherwise. */
  conflict?: true;
}

/**
 * One requirement of a PEP 508 dependency specification.
 * @since 3.1.10
 */
export interface Pep508Dependency {
  /** The distribution name, as written. */
  name: string;
  /** The extras, `['security', 'socks']` for `requests[security,socks]`; empty if none. */
  extras: string[];
  /** The version specifiers, all of which must hold (`>=2.0,<3` is two); empty if none. Empty too for a URL requirement. */
  specifiers: DependencyConstraint<Pep508Operator>[];
  /** The direct reference of `name @ https://...`. */
  url?: string;
  /** The environment marker after the `;`, as written (`python_version < "3.9"`). Not evaluated. */
  marker?: string;
}

/**
 * Options of the Debian format of {@link parseDependencies}.
 * @since 3.1.10
 */
export interface DebianDependencyOptions {
  /**
   * Also accept the obsolete `<` and `>` operators that old packages still carry, and read them as
   * dpkg does, `<=` and `>=` (Policy forbids them because they look like the opposite). Off by
   * default: they throw a `SyntaxError`, like `satisfiesRange(..., 'debian')` from
   * `@helpers4/version` does.
   */
  compat?: boolean;
}

/**
 * For each supported format, the shape of one dependency and the options its parser takes. This is
 * what makes {@link parseDependencies} and {@link stringifyDependencies} type-safe per format.
 * @since 3.1.10
 */
export interface DependencyFormats {
  debian: { dependency: DebianDependency; options: DebianDependencyOptions };
  rpm: { dependency: RpmDependency; options: undefined };
  arch: { dependency: ArchDependency; options: undefined };
  alpine: { dependency: AlpineDependency; options: undefined };
  pep508: { dependency: Pep508Dependency; options: undefined };
}

/**
 * The formats of dependency fields: `'debian'`, `'rpm'`, `'arch'`, `'alpine'` and `'pep508'`.
 * @since 3.1.10
 */
export type DependencyFormat = keyof DependencyFormats;

/**
 * The dependency type of a format.
 * @since 3.1.10
 */
export type DependencyOf<Format extends DependencyFormat> = DependencyFormats[Format]['dependency'];

/**
 * The alternatives (`a | b`) that satisfy one entry of a dependency field. A format without
 * alternatives (`'arch'`, `'alpine'`, `'pep508'`) always has a single one.
 * @since 3.1.10
 */
export type DependencyGroup<Dependency> = Dependency[];

/**
 * The extra arguments of {@link parseDependencies}: the options of the format if it has some, none
 * otherwise.
 * @since 3.1.10
 */
export type ParseDependenciesOptions<Format extends DependencyFormat> = DependencyFormats[Format]['options'] extends undefined
  ? []
  : [options?: DependencyFormats[Format]['options']];
