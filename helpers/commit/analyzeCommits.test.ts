/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { analyzeCommits } from './analyzeCommits';

describe('analyzeCommits', () => {
  it('returns patch with no-commits reason for an empty list', () => {
    const result = analyzeCommits([]);
    expect(result.suggestedBump).toBe('patch');
    expect(result.reason).toBe('No commits to analyse');
    expect(result.hasBreakingChanges).toBe(false);
    expect(result.hasFeatures).toBe(false);
    expect(result.hasFixes).toBe(false);
  });

  it('suggests major when a commit has the `!` marker', () => {
    const result = analyzeCommits([{ subject: 'feat!: drop v1' }]);
    expect(result.suggestedBump).toBe('major');
    expect(result.hasBreakingChanges).toBe(true);
    expect(result.hasFeatures).toBe(true);
  });

  it('suggests major when a body has BREAKING CHANGE footer', () => {
    const result = analyzeCommits([
      { subject: 'feat: add x', body: 'BREAKING CHANGE: drops old behaviour' },
    ]);
    expect(result.suggestedBump).toBe('major');
    expect(result.hasBreakingChanges).toBe(true);
  });

  it('detects BREAKING-CHANGE (hyphen variant) too', () => {
    const result = analyzeCommits([
      { subject: 'feat: add x', body: 'BREAKING-CHANGE: drops old behaviour' },
    ]);
    expect(result.hasBreakingChanges).toBe(true);
  });

  it('suggests minor when only features are present', () => {
    const result = analyzeCommits([
      { subject: 'feat: a' },
      { subject: 'feat(api): b' },
      { subject: 'docs: c' },
    ]);
    expect(result.suggestedBump).toBe('minor');
    expect(result.hasFeatures).toBe(true);
    expect(result.hasBreakingChanges).toBe(false);
  });

  it('suggests patch when only fixes are present', () => {
    const result = analyzeCommits([
      { subject: 'fix: a' },
      { subject: 'fix(api): b' },
    ]);
    expect(result.suggestedBump).toBe('patch');
    expect(result.hasFixes).toBe(true);
    expect(result.hasFeatures).toBe(false);
  });

  it('prioritises major > minor > patch', () => {
    const result = analyzeCommits([
      { subject: 'fix: bug' },
      { subject: 'feat: thing' },
      { subject: 'feat!: drop' },
    ]);
    expect(result.suggestedBump).toBe('major');
    expect(result.hasBreakingChanges).toBe(true);
    expect(result.hasFeatures).toBe(true);
    expect(result.hasFixes).toBe(true);
  });

  it('falls back to patch when commits exist but none are conventional', () => {
    const result = analyzeCommits([
      { subject: 'random commit' },
      { subject: 'another non-conventional one' },
    ]);
    expect(result.suggestedBump).toBe('patch');
    expect(result.reason).toBe('Changes detected but no conventional commit types found');
    expect(result.hasFeatures).toBe(false);
    expect(result.hasFixes).toBe(false);
    expect(result.hasBreakingChanges).toBe(false);
  });

  it('ignores body when it is omitted', () => {
    const result = analyzeCommits([{ subject: 'feat: x' }]);
    expect(result.hasFeatures).toBe(true);
  });

  it('ignores non-feat/fix conventional types for the suggestion', () => {
    const result = analyzeCommits([
      { subject: 'docs: tweak' },
      { subject: 'chore: deps' },
      { subject: 'refactor: tidy' },
    ]);
    expect(result.suggestedBump).toBe('patch');
    expect(result.reason).toBe('Changes detected but no conventional commit types found');
  });
});
