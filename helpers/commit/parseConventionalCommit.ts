/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { buildConventionalCommitRegex } from './buildConventionalCommitRegex';
import type { ConventionalCommitOptions, ParsedConventionalCommit } from './types';

const FOOTER_LINE = /^(?:BREAKING[ -]CHANGE|[A-Za-z][A-Za-z0-9-]*)(?:: | #)/;
const BREAKING_FOOTER = /^BREAKING[ -]CHANGE: /m;

function splitBodyAndFooter(rest: string): { body: string; footer: string } {
  if (rest.length === 0) return { body: '', footer: '' };

  const paragraphs = rest.split(/\n{2,}/);
  const last = paragraphs[paragraphs.length - 1];
  const lastLines = last.split('\n');
  const isFooter = lastLines.every(line => FOOTER_LINE.test(line));

  if (isFooter && paragraphs.length > 1) {
    return {
      body: paragraphs.slice(0, -1).join('\n\n'),
      footer: last,
    };
  }

  if (isFooter && paragraphs.length === 1) {
    return { body: '', footer: last };
  }

  return { body: rest, footer: '' };
}

/**
 * Parses a Conventional Commits message into a structured object.
 *
 * The first line is matched against the regex produced by
 * `buildConventionalCommitRegex(options)`. The remaining content is split into
 * a `body` and an optional trailing `footer` block (lines matching
 * `Token: value` / `Token #value`, including `BREAKING CHANGE: ...`).
 *
 * @param message - Full commit message (subject + optional body/footer).
 * @param options - Optional constraints forwarded to the regex builder.
 * @returns Parsed commit object, or `null` when the subject is not conventional.
 * @example
 * parseConventionalCommit('feat(api)!: add v2\n\nDetails here')
 * // => { type: 'feat', scope: 'api', breaking: true, description: 'add v2', body: 'Details here', footer: '' }
 *
 * parseConventionalCommit('not conventional') // => null
 * @since 2.0.0
 */
export function parseConventionalCommit(
  message: string,
  options?: ConventionalCommitOptions,
): ParsedConventionalCommit | null {
  if (typeof message !== 'string' || message.length === 0) return null;

  const normalized = message.replace(/\r\n/g, '\n');
  const newlineIndex = normalized.indexOf('\n');
  const subject = newlineIndex === -1 ? normalized : normalized.slice(0, newlineIndex);
  const rest = newlineIndex === -1 ? '' : normalized.slice(newlineIndex + 1).replace(/^\n+/, '').replace(/\n+$/, '');

  const regex = buildConventionalCommitRegex(options);
  const match = regex.exec(subject);
  if (!match) return null;

  const [, type, scope, breakingMarker, description] = match;
  const { body, footer } = splitBodyAndFooter(rest);
  const breaking = breakingMarker === '!' || BREAKING_FOOTER.test(`${body}\n${footer}`);

  return {
    type,
    scope: scope ?? null,
    breaking,
    description,
    body,
    footer,
  };
}
