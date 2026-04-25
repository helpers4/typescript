/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parseConventionalCommit } from './parseConventionalCommit';
import type { AnalyzableCommit, CommitAnalysis, CommitVersionBump } from './types';

/**
 * Analyses a list of commits to suggest a semantic version bump.
 *
 * Each commit is parsed via `parseConventionalCommit`. The body is also
 * scanned for `BREAKING CHANGE:` / `BREAKING-CHANGE:` markers. The bump rule
 * is:
 *
 * - any breaking change → `'major'`
 * - otherwise any `feat` → `'minor'`
 * - otherwise any `fix` → `'patch'`
 * - otherwise (non-empty list of non-conventional commits) → `'patch'`
 * - empty list → `'patch'` with reason "No commits to analyse"
 *
 * @param commits - Iterable of commits to analyse. Only `subject` is required.
 * @returns Aggregated analysis with the suggested bump and reason.
 * @example
 * analyzeCommits([{ subject: 'feat: add x' }, { subject: 'fix: bug' }])
 * // => { suggestedBump: 'minor', hasFeatures: true, hasFixes: true, ... }
 *
 * analyzeCommits([{ subject: 'feat!: drop v1' }])
 * // => { suggestedBump: 'major', hasBreakingChanges: true, ... }
 * @since next
 */
export function analyzeCommits(commits: readonly AnalyzableCommit[]): CommitAnalysis {
  let hasBreakingChanges = false;
  let hasFeatures = false;
  let hasFixes = false;

  for (const commit of commits) {
    const fullMessage = commit.body
      ? `${commit.subject}\n\n${commit.body}`
      : commit.subject;
    const parsed = parseConventionalCommit(fullMessage);

    if (parsed) {
      if (parsed.breaking) hasBreakingChanges = true;
      if (parsed.type === 'feat') hasFeatures = true;
      if (parsed.type === 'fix') hasFixes = true;
    }
  }

  let suggestedBump: CommitVersionBump;
  let reason: string;

  if (hasBreakingChanges) {
    suggestedBump = 'major';
    reason = 'Breaking changes detected in commits';
  } else if (hasFeatures) {
    suggestedBump = 'minor';
    reason = 'New features detected in commits';
  } else if (hasFixes) {
    suggestedBump = 'patch';
    reason = 'Bug fixes detected in commits';
  } else if (commits.length > 0) {
    suggestedBump = 'patch';
    reason = 'Changes detected but no conventional commit types found';
  } else {
    suggestedBump = 'patch';
    reason = 'No commits to analyse';
  }

  return {
    suggestedBump,
    reason,
    hasBreakingChanges,
    hasFeatures,
    hasFixes,
  };
}
