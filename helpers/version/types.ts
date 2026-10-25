/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Identifies which version scheme {@link parse}/{@link compare} should use to interpret a
 * version string. Defaults to `'semver'` everywhere it's accepted.
 * @since 3.0.8
 */
export type VersionScheme = 'semver' | 'gentoo' | 'debian' | 'rpm' | 'pacman' | 'pep440';

/** The unit to bump — see {@link increment}. */
export type IncrementType = 'major' | 'minor' | 'patch';

/**
 * A version parsed according to SemVer 2.0.0 (`MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]`).
 *
 * This is what {@link ParsedVersion} has always meant since 2.0.0 — that name stays an alias
 * for exactly this shape (see {@link ParsedVersion}'s own doc for why), so existing code
 * accessing `.major`/`.minor`/`.patch` on a `ParsedVersion` keeps compiling unchanged. Use
 * {@link AnyParsedVersion} for a value that could be parsed in any supported scheme.
 * @since 3.0.8
 */
export interface ParsedSemVerVersion {
  scheme: 'semver';
  /** Major version number */
  major: number;
  /** Minor version number */
  minor: number;
  /** Patch version number */
  patch: number;
  /** Pre-release identifiers (e.g., ['alpha', '1'] for -alpha.1) */
  prerelease: string[];
  /** Build metadata identifiers (e.g., ['build', '123'] for +build.123) */
  build: string[];
}

/**
 * One Gentoo/Portage suffix type, in ascending order of precedence: `alpha` and `beta` sort
 * below the plain release, `pre` and `rc` do too (closer to release), and `p` (patch level)
 * sorts *above* it — see {@link ParsedGentooVersion}.
 * @since 3.0.8
 */
export type GentooSuffixType = 'alpha' | 'beta' | 'pre' | 'rc' | 'p';

/**
 * One suffix segment of a Gentoo/Portage version, e.g. `_alpha1` → `{ type: 'alpha', number: 1 }`.
 * @since 3.0.8
 */
export interface GentooSuffix {
  type: GentooSuffixType;
  /** Trailing digits after the suffix type, or `0` if none were given (e.g. bare `_beta`). */
  number: number;
}

/**
 * A version parsed according to the Gentoo/Portage ebuild version specification (Package
 * Manager Specification §3.2–3.3): `<components>[<letter>](_<suffix><n>?)*[-r<revision>]`,
 * e.g. `1.2.3b_rc1-r2`.
 *
 * This implementation covers the common case of **zero or one** suffix segment (`_alpha1`,
 * `_p2`, or none) — real-world ebuild versions essentially never chain multiple different
 * suffix types (`_alpha1_rc2`), so {@link compare}'s Gentoo-scheme ordering only considers the
 * *last* suffix segment present when more than one appears.
 * @since 3.0.8
 */
export interface ParsedGentooVersion {
  scheme: 'gentoo';
  /** Dot-separated numeric components, e.g. `[1, 2, 3]` for `1.2.3`. Arbitrary length. */
  components: number[];
  /** Single lowercase letter suffix directly after the numeric components (e.g. `'b'` in `1.2.3b`), or `''` if none. */
  letter: string;
  /** Suffix segments in the order they appear, e.g. `[{ type: 'rc', number: 1 }]` for `_rc1`. */
  suffixes: GentooSuffix[];
  /** Revision after `-r` (e.g. `2` for `-r2`), or `0` if no revision suffix is present. */
  revision: number;
}

/**
 * A version parsed according to Debian Policy §5.6.12 (the `Version` field dpkg and apt
 * order): `[epoch:]upstream[-revision]`, e.g. `1:2.30~rc1-3ubuntu2`.
 *
 * The upstream part is kept as a string: Debian puts no structure on it beyond its sort order
 * (digit runs compare numerically, `~` sorts before everything), so there's no
 * major/minor/patch to extract.
 * @since 3.1.3
 */
export interface ParsedDebianVersion {
  scheme: 'debian';
  /** Epoch before the first `:` (e.g. `1` for `1:2.30-3`), or `0` if none is given. */
  epoch: number;
  /** Upstream version, between the epoch and the last `-` (e.g. `'2.30~rc1'`). Never empty. */
  upstream: string;
  /** Debian revision after the last `-` (e.g. `'3ubuntu2'`), or `''` for a native package without one. */
  revision: string;
}

/**
 * A version parsed according to the RPM version format (Fedora, RHEL, openSUSE):
 * `[epoch:]version[-release]`, e.g. `1:2.30~rc1-3.fc40`. Ordering follows `rpmvercmp`,
 * including its `~` (sorts before everything) and `^` (sorts after the end, before anything
 * else) extensions.
 * @since next
 */
export interface ParsedRpmVersion {
  scheme: 'rpm';
  /** Epoch before the first `:`, or `0` if none is given. */
  epoch: number;
  /** Version, between the epoch and the `-` that starts the release (e.g. `'2.30~rc1'`). Never empty. */
  version: string;
  /** Release after the last `-` (e.g. `'3.fc40'`), or `''` if none is given. */
  release: string;
}

/**
 * A version parsed according to Arch Linux's pacman (libalpm) version format:
 * `[epoch:]pkgver[-pkgrel]`, e.g. `1:2.30rc1-3`. Ordering follows `vercmp`: alphanumeric
 * segments are compared one by one, numbers above letters, and a trailing letter segment sorts
 * below the same version without it (`1.0rc1` < `1.0`).
 * @since next
 */
export interface ParsedPacmanVersion {
  scheme: 'pacman';
  /** Epoch before the first `:`, or `0` if none is given. */
  epoch: number;
  /** Package version, between the epoch and the last `-` (e.g. `'2.30rc1'`). Never empty. */
  version: string;
  /** Package release after the last `-` (e.g. `'3'`), or `''` if none is given. */
  release: string;
}

/**
 * A pre-release marker of a PEP 440 version: `a` (alpha), `b` (beta) or `rc` (release candidate).
 * @since next
 */
export interface Pep440Prerelease {
  type: 'a' | 'b' | 'rc';
  number: number;
}

/**
 * A version parsed according to PEP 440 (Python packaging):
 * `[N!]N(.N)*[{a|b|rc}N][.postN][.devN][+local]`, e.g. `1!2.0rc1.post2.dev3+ubuntu.1`. Every
 * spelling PEP 440 accepts (`1.0-alpha`, `1.0.RC1`, `v1.0-1`, ...) is normalized when parsing.
 * @since next
 */
export interface ParsedPep440Version {
  scheme: 'pep440';
  /** Epoch before the `!`, or `0` if none is given. */
  epoch: number;
  /** The release segment (e.g. `[1, 2, 3]` for `1.2.3`). Never empty. */
  release: number[];
  /** The pre-release marker, or `null`. */
  pre: Pep440Prerelease | null;
  /** The post-release number, or `null`. */
  post: number | null;
  /** The development release number, or `null`. */
  dev: number | null;
  /** The local version label after the `+`, split on its separators (numbers as numbers, the rest lowercased). Empty if none. */
  local: (number | string)[];
}

/**
 * A version parsed by {@link parse}, in whichever scheme it was parsed as — narrow on the
 * `scheme` field to access scheme-specific properties (`major`/`minor`/`patch` for `'semver'`,
 * `components`/`letter`/`suffixes`/`revision` for `'gentoo'`, `epoch`/`upstream`/`revision` for
 * `'debian'`, `epoch`/`version`/`release` for `'rpm'` and `'pacman'`, `epoch`/`release`/`pre`/`post`/`dev`/`local`
 * for `'pep440'`).
 *
 * Deliberately **not** named `ParsedVersion`: that name has been public API since 2.0.0 for
 * the flat SemVer-only shape (`.major`/`.minor`/`.patch` directly, no narrowing needed), and
 * turning it into a union would silently break any existing code typed as `ParsedVersion` that
 * reads those fields without narrowing first — a real compatibility break with no
 * `MIGRATION.md` entry, since this repo ties breaking changes to major-version bumps.
 * @since 3.0.8
 */
export type AnyParsedVersion =
  | ParsedSemVerVersion
  | ParsedGentooVersion
  | ParsedDebianVersion
  | ParsedRpmVersion
  | ParsedPacmanVersion
  | ParsedPep440Version;

/**
 * A version parsed according to SemVer 2.0.0 — alias of {@link ParsedSemVerVersion}, kept under
 * this name for backward compatibility (public API since 2.0.0, well before Gentoo/Portage
 * support existed). Use {@link AnyParsedVersion} to accept a parsed version in any supported
 * scheme, e.g. when writing scheme-agnostic code like {@link stringify} or {@link isPrerelease}.
 * @since 2.0.0
 */
export type ParsedVersion = ParsedSemVerVersion;
