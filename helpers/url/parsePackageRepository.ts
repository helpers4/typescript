/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Structured representation of a parsed `repository` field from `package.json`.
 *
 * @since next
 */
export interface PackageRepository {
  /**
   * VCS type (e.g. `'git'`, `'svn'`).
   * Defaults to `'git'` when using shorthand string forms.
   */
  readonly type: string;
  /**
   * Hosting platform.
   * Well-known values: `'github'`, `'gitlab'`, `'bitbucket'`, `'gist'`.
   * Falls back to the raw domain (e.g. `'codeberg.org'`) for unknown hosts.
   */
  readonly host: 'github' | 'gitlab' | 'bitbucket' | 'gist' | (string & {});
  /**
   * `<owner>/<repo>` slug.
   * `undefined` for gist shorthands (`gist:<id>`) and unrecognised URL shapes.
   */
  readonly slug: string | undefined;
  /**
   * Repository owner or organisation.
   * `undefined` for gist shorthands.
   */
  readonly owner: string | undefined;
  /**
   * Repository name.
   * `undefined` for gist shorthands.
   */
  readonly repo: string | undefined;
  /**
   * Gist identifier — only set when using the `gist:<id>` shorthand form.
   */
  readonly gistId: string | undefined;
  /**
   * Monorepo sub-directory from the `directory` field of the object form.
   * `undefined` when using shorthand string forms or when no `directory` is specified.
   */
  readonly directory: string | undefined;
}

/** Maps known GitHub/GitLab/Bitbucket domains to their platform name. */
const DOMAIN_TO_HOST: Record<string, string> = {
  'github.com': 'github',
  'gitlab.com': 'gitlab',
  'bitbucket.org': 'bitbucket',
};

/** SCP-style SSH URL: `git@github.com:owner/repo.git` */
const RE_SSH_SCP = /^git@([\w.-]+):([\w.-]+\/[\w.-]+?)(?:\.git)?(?:[#?].*)?$/;

/**
 * URL-form remote: `git+https://…`, `https://…`, `git://…`, `git+ssh://git@…`
 * Captures: [1] domain, [2] owner/repo path
 */
const RE_URL =
  /^(?:git\+(?:https?|ssh)|https?|git):\/\/(?:[^@/]+@)?([\w.-]+)\/([\w.-]+\/[\w.-]+?)(?:\.git)?(?:[#?].*)?$/;

function makeOwnerRepoResult(
  type: string,
  host: string,
  rawPath: string,
  directory: string | undefined,
): PackageRepository {
  const slashIdx = rawPath.indexOf('/');
  const owner = rawPath.slice(0, slashIdx);
  const repo = rawPath.slice(slashIdx + 1);
  return { type, host, slug: `${owner}/${repo}`, owner, repo, gistId: undefined, directory };
}

function parseRawUrl(
  raw: string,
  type: string,
  directory: string | undefined,
): PackageRepository | undefined {
  // Shorthand prefix: "github:owner/repo", "gitlab:owner/repo", "bitbucket:owner/repo"
  const shorthandMatch = /^(github|gitlab|bitbucket):([\w.-]+\/[\w.-]+)$/.exec(raw);
  if (shorthandMatch) {
    const host = shorthandMatch[1] as 'github' | 'gitlab' | 'bitbucket';
    const slug = shorthandMatch[2];
    const slashIdx = slug.indexOf('/');
    const owner = slug.slice(0, slashIdx);
    const repo = slug.slice(slashIdx + 1);
    return { type, host, slug, owner, repo, gistId: undefined, directory };
  }

  // Gist shorthand: "gist:<id>"
  const gistMatch = /^gist:([\w-]+)$/.exec(raw);
  if (gistMatch) {
    return { type, host: 'gist', slug: undefined, owner: undefined, repo: undefined, gistId: gistMatch[1], directory };
  }

  // Bare GitHub shorthand: "owner/repo" (no colon prefix, no protocol)
  const bareMatch = /^([\w.-]+)\/([\w.-]+)$/.exec(raw);
  if (bareMatch) {
    const owner = bareMatch[1];
    const repo = bareMatch[2];
    return { type, host: 'github', slug: `${owner}/${repo}`, owner, repo, gistId: undefined, directory };
  }

  // SCP-style SSH: git@github.com:owner/repo.git
  const sshMatch = RE_SSH_SCP.exec(raw);
  if (sshMatch) {
    const host = DOMAIN_TO_HOST[sshMatch[1]] ?? sshMatch[1];
    return makeOwnerRepoResult(type, host, sshMatch[2], directory);
  }

  // URL-form: https://, git+https://, git://, git+ssh://
  const urlMatch = RE_URL.exec(raw);
  if (urlMatch) {
    const host = DOMAIN_TO_HOST[urlMatch[1]] ?? urlMatch[1];
    return makeOwnerRepoResult(type, host, urlMatch[2], directory);
  }

  return undefined;
}

/**
 * Parse the `repository` field from `package.json` into a structured object.
 *
 * Supports all npm-specified formats:
 * - **Object form**: `{ "type": "git", "url": "...", "directory": "..." }`
 * - **GitHub shorthand**: `"owner/repo"` or `"github:owner/repo"`
 * - **Platform shorthands**: `"gitlab:owner/repo"`, `"bitbucket:owner/repo"`
 * - **Gist shorthand**: `"gist:<id>"`
 * - **URL forms**: `git+https://`, `https://`, `git://`, `git@` SSH, `git+ssh://`
 *
 * Returns `undefined` for `null`, `undefined`, arrays, or values that cannot
 * be matched to any recognised format.
 *
 * @param repository - The `repository` field value from `package.json`.
 * @returns A parsed {@link PackageRepository} object, or `undefined` if the
 *   input cannot be parsed.
 * @example
 * parsePackageRepository({ type: 'git', url: 'git+https://github.com/helpers4/typescript.git' })
 * // => { type: 'git', host: 'github', slug: 'helpers4/typescript', owner: 'helpers4',
 * //      repo: 'typescript', gistId: undefined, directory: undefined }
 * @example
 * parsePackageRepository('github:helpers4/typescript')
 * // => { type: 'git', host: 'github', slug: 'helpers4/typescript', owner: 'helpers4',
 * //      repo: 'typescript', gistId: undefined, directory: undefined }
 * @since next
 */
export function parsePackageRepository(repository: unknown): PackageRepository | undefined {
  if (repository === null || repository === undefined) return undefined;

  if (typeof repository === 'string') {
    return parseRawUrl(repository, 'git', undefined);
  }

  if (typeof repository === 'object' && !Array.isArray(repository)) {
    const obj = repository as Record<string, unknown>;
    const rawUrl = obj['url'];
    if (typeof rawUrl !== 'string') return undefined;
    const type = typeof obj['type'] === 'string' ? (obj['type'] as string) : 'git';
    const directory = typeof obj['directory'] === 'string' ? (obj['directory'] as string) : undefined;
    return parseRawUrl(rawUrl, type, directory);
  }

  return undefined;
}
