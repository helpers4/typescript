/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Options shared by `buildConventionalCommitRegex`, `parseConventionalCommit`,
 * and `isConventionalCommit` to constrain the accepted commit format.
 *
 * @since 2.0.0
 */
export interface ConventionalCommitOptions {
  /**
   * Allowed commit types (e.g. `['feat', 'fix', 'chore']`). When omitted, any
   * lowercase/uppercase letters word is accepted.
   */
  readonly types?: readonly string[];
  /**
   * Allowed scopes. When omitted, any non-whitespace, non-parenthesis content
   * is accepted as a scope.
   */
  readonly scopes?: readonly string[];
  /**
   * When `true`, the scope segment becomes mandatory. Defaults to `false`.
   */
  readonly requireScope?: boolean;
}

/**
 * Parsed representation of a Conventional Commit message.
 *
 * @since 2.0.0
 */
export interface ParsedConventionalCommit {
  /** Commit type (e.g. `feat`, `fix`). */
  readonly type: string;
  /** Optional scope, or `null` when absent. */
  readonly scope: string | null;
  /** `true` when the commit declares a breaking change (via `!` or footer). */
  readonly breaking: boolean;
  /** Subject line description (text after `: `). */
  readonly description: string;
  /** Body paragraphs (excluding the subject and any trailing footer block). */
  readonly body: string;
  /** Trailing footer block (lines like `BREAKING CHANGE: ...` or `Refs: #1`). */
  readonly footer: string;
}

/**
 * Minimal commit shape consumed by `analyzeCommits`. Only the subject line is
 * mandatory; the body is scanned for a `BREAKING CHANGE` footer.
 *
 * @since 2.0.0
 */
export interface AnalyzableCommit {
  readonly subject: string;
  readonly body?: string;
}

/**
 * Bumping suggestion produced by `analyzeCommits`.
 *
 * @since 2.0.0
 */
export type CommitVersionBump = 'major' | 'minor' | 'patch';

/**
 * Aggregated result of `analyzeCommits`.
 *
 * @since 2.0.0
 */
export interface CommitAnalysis {
  /** Suggested semantic version bump for the supplied commits. */
  readonly suggestedBump: CommitVersionBump;
  /** Human-readable explanation behind `suggestedBump`. */
  readonly reason: string;
  /** `true` when at least one commit declares a breaking change. */
  readonly hasBreakingChanges: boolean;
  /** `true` when at least one commit is a `feat`. */
  readonly hasFeatures: boolean;
  /** `true` when at least one commit is a `fix`. */
  readonly hasFixes: boolean;
}
