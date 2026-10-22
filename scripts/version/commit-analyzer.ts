/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { analyzeCommits as analyzeCommitsHelper } from '../../helpers/commit/analyzeCommits';
import { getLatestTag } from './git-utils';

const execAsync = promisify(exec);

export type VersionType = 'major' | 'minor' | 'patch' | 'prerelease';

export interface CommitInfo {
  hash: string;
  subject: string;
  body: string;
  author: string;
  date: Date;
}

export interface VersionCalculationResult {
  suggestedType: VersionType;
  reason: string;
  commits: CommitInfo[];
  hasBreakingChanges: boolean;
  hasFeatures: boolean;
  hasFixes: boolean;
}

/**
 * Get commits since a specific reference (tag or commit)
 */
export async function getCommitsSince(since: string): Promise<CommitInfo[]> {
  try {
    const { stdout } = await execAsync(
      `git log ${since}..HEAD --pretty=format:"%H|||%s|||%b|||%an|||%ad" --date=iso`
    );

    if (!stdout.trim()) {
      return [];
    }

    const commitLines = stdout.trim().split('\n');
    return commitLines.map(line => {
      const [hash, subject, body, author, date] = line.split('|||');
      return {
        author,
        body: body || '',
        date: new Date(date),
        hash,
        subject
      };
    });
  } catch (error) {
    throw new Error(`Failed to get commits since ${since}: ${error}`, { cause: error });
  }
}

/**
 * Analyze commit messages using conventional commits format.
 *
 * Thin adapter around `analyzeCommits` from `helpers/commit` that preserves
 * this script's `VersionCalculationResult` shape (carrying the original
 * `CommitInfo[]` for downstream logging).
 */
export function analyzeCommits(commits: CommitInfo[]): VersionCalculationResult {
  const analysis = analyzeCommitsHelper(commits);
  const reason = commits.length === 0
    ? 'No commits since last tag'
    : analysis.reason;

  return {
    commits,
    hasBreakingChanges: analysis.hasBreakingChanges,
    hasFeatures: analysis.hasFeatures,
    hasFixes: analysis.hasFixes,
    reason,
    suggestedType: analysis.suggestedBump,
  };
}

/**
 * Calculate version type based on git history
 */
export async function calculateVersionFromCommits(): Promise<VersionCalculationResult> {
  console.log('🔍 Analyzing git history to determine version type...');

  // Get latest tag
  const latestTag = await getLatestTag();

  if (!latestTag) {
    console.log('ℹ️  No git tags found, analyzing all commits');
    // If no tags, analyze last 50 commits or all commits
    try {
      const { stdout } = await execAsync('git rev-list --count HEAD');
      const totalCommits = Number.parseInt(stdout.trim(), 10);
      const limit = Math.min(totalCommits, 50);
      const { stdout: commitStdout } = await execAsync(
        `git log -${limit} --pretty=format:"%H|||%s|||%b|||%an|||%ad" --date=iso`
      );

      const commitLines = commitStdout.trim().split('\n').filter(Boolean);
      const commits = commitLines.map(line => {
        const [hash, subject, body, author, date] = line.split('|||');
        return {
          author,
          body: body || '',
          date: new Date(date),
          hash,
          subject
        };
      });

      const result = analyzeCommits(commits);
      console.log(`📊 Analyzed ${commits.length} commits (no previous tags)`);
      return result;
    } catch (error) {
      throw new Error(`Failed to analyze commits: ${error}`, { cause: error });
    }
  }

  console.log(`📌 Latest tag: ${latestTag}`);

  // Get commits since latest tag
  const commits = await getCommitsSince(latestTag);
  console.log(`📊 Found ${commits.length} commits since ${latestTag}`);

  const result = analyzeCommits(commits);

  // Print commit summary
  if (commits.length > 0) {
    console.log('\n📝 Commit analysis:');
    console.log(`   - Breaking changes: ${result.hasBreakingChanges ? '✅' : '❌'}`);
    console.log(`   - New features: ${result.hasFeatures ? '✅' : '❌'}`);
    console.log(`   - Bug fixes: ${result.hasFixes ? '✅' : '❌'}`);

    if (process.env.VERBOSE) {
      console.log('\n📋 Recent commits:');
      commits.slice(0, 5).forEach(commit => {
        console.log(`   - ${commit.subject.slice(0, 50)}... (${commit.hash.slice(0, 7)})`);
      });

      if (commits.length > 5) {
        console.log(`   ... and ${commits.length - 5} more commits`);
      }
    }
  }

  console.log(`\n💡 Suggested version type: ${result.suggestedType}`);
  console.log(`📝 Reason: ${result.reason}\n`);

  return result;
}

/**
 * Prompt user for confirmation or override
 */
export async function promptVersionType(suggested: VersionType): Promise<VersionType> {
  // In automated environments, use the suggested type
  if (process.env.CI || process.env.AUTOMATED) {
    return suggested;
  }

  // For interactive use, you could implement a prompt here
  // For now, just return the suggested type
  return suggested;
}
