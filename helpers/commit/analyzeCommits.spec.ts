/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { analyzeCommits } from './analyzeCommits';
import type { AnalyzableCommit } from './types';

const featCommitArb = fc.stringMatching(/^[A-Za-z0-9 _-]+$/)
  .filter(value => value.length > 0)
  .map<AnalyzableCommit>(description => ({ subject: `feat: ${description}` }));

const fixCommitArb = fc.stringMatching(/^[A-Za-z0-9 _-]+$/)
  .filter(value => value.length > 0)
  .map<AnalyzableCommit>(description => ({ subject: `fix: ${description}` }));

describe('analyzeCommits — property-based', () => {
  it('any non-empty list of feat commits suggests minor', () => {
    fc.assert(
      fc.property(fc.array(featCommitArb, { minLength: 1, maxLength: 10 }), commits => {
        const result = analyzeCommits(commits);
        expect(result.suggestedBump).toBe('minor');
        expect(result.hasFeatures).toBe(true);
        expect(result.hasBreakingChanges).toBe(false);
      }),
    );
  });

  it('any non-empty list of fix commits suggests patch', () => {
    fc.assert(
      fc.property(fc.array(fixCommitArb, { minLength: 1, maxLength: 10 }), commits => {
        const result = analyzeCommits(commits);
        expect(result.suggestedBump).toBe('patch');
        expect(result.hasFixes).toBe(true);
        expect(result.hasFeatures).toBe(false);
      }),
    );
  });

  it('adding a breaking commit always upgrades the suggestion to major', () => {
    fc.assert(
      fc.property(fc.array(fc.oneof(featCommitArb, fixCommitArb), { maxLength: 5 }), commits => {
        const withBreaking = [...commits, { subject: 'feat!: drop' }];
        expect(analyzeCommits(withBreaking).suggestedBump).toBe('major');
      }),
    );
  });
});

describe('analyzeCommits — contract', () => {
  it('empty list → patch / "No commits to analyse"', () => {
    expect(analyzeCommits([])).toEqual({
      suggestedBump: 'patch',
      reason: 'No commits to analyse',
      hasBreakingChanges: false,
      hasFeatures: false,
      hasFixes: false,
    });
  });

  it('single feat → minor', () => {
    expect(analyzeCommits([{ subject: 'feat: x' }]).suggestedBump).toBe('minor');
  });

  it('single fix → patch', () => {
    expect(analyzeCommits([{ subject: 'fix: x' }]).suggestedBump).toBe('patch');
  });

  it('breaking → major', () => {
    expect(analyzeCommits([{ subject: 'feat!: x' }]).suggestedBump).toBe('major');
  });
});
