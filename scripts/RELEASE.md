# Releasing

Releases are made by [`.github/workflows/release.yml`](../.github/workflows/release.yml), which runs
[helpers4/action-release](https://github.com/helpers4/action-release). One version for every package.

## Run a release

*Actions -> Release -> Run workflow*, from `main`:

| Input | |
| --- | --- |
| `bump` | `auto` (from the Conventional Commits), `patch`, `minor`, `major`, `alpha` / `beta` / `rc` (prereleases, from any branch), or `resume` |
| `dry-run` | Build and dry-run everything, write nothing. The run summary shows the version, the packages and the notes. |

Run a dry-run first. A stable release only runs from `main`.

## What it does

1. The gates of a pull request (lint, types, tests with coverage, security) run on the commit to release.
2. The version is computed and written in `package.json`; `@since next` becomes the version in
   `helpers/` (a prerelease keeps `next`); `CHANGELOG.md` gets the section of the version. A summary
   written by hand under `## [Unreleased]` leads that section and the GitHub release notes.
3. `pnpm run build && pnpm coherency` build `build/<package>/` for every category, the presets and the
   bundles, each with that version, and check them. Every package is dry-run with `npm publish`.
4. The signed release commit goes to `main` (as `helpers4-bot`), is tagged, and every package is published
   to npm with trusted publishing (the dependencies of a package first: the bundles come last), then the
   GitHub release is published with the build metadata and its provenance.
5. The website is told to regenerate its docs.

Anything wrong before step 4 stops the release with nothing written. After the commit, *Re-run failed jobs*
(or `bump: resume`) publishes only what npm does not serve yet.

## A new category

A new `@helpers4/<category>` package must exist on npm before it can have a trusted publisher: see
"Adding a category" in [CONTRIBUTING.md](../CONTRIBUTING.md). The release stops before writing anything
if one is missing.

## Failures

Every message is explained in the
[troubleshooting guide](https://github.com/helpers4/action-release/blob/main/docs/troubleshooting.md).
