/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { buildConventionalCommitRegex } from './buildConventionalCommitRegex';
import type { ConventionalCommitOptions } from './types';

/**
 * Checks whether a commit message's subject line follows the Conventional
 * Commits format constrained by the given options.
 *
 * Only the first line is inspected — body and footer are ignored.
 *
 * @param message - Full commit message or just its subject line.
 * @param options - Optional constraints (allowed types/scopes, scope requirement).
 * @returns `true` when the subject line matches; `false` otherwise.
 * @example
 * isConventionalCommit('feat(api): add endpoint') // => true
 * isConventionalCommit('hello world') // => false
 * isConventionalCommit('chore: x', { types: ['feat', 'fix'] }) // => false
 * @since 2.0.0
 */
export function isConventionalCommit(
  message: string,
  options?: ConventionalCommitOptions,
): boolean {
  if (typeof message !== 'string' || message.length === 0) return false;
  const normalized = message.replace(/\r\n/g, '\n');
  const newlineIndex = normalized.indexOf('\n');
  const subject = newlineIndex === -1 ? normalized : normalized.slice(0, newlineIndex);
  return buildConventionalCommitRegex(options).test(subject);
}
