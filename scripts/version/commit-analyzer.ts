/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { exec } from 'child_process';
import { promisify } from 'util';
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
        hash,
        subject,
        body: body || '',
        author,
        date: new Date(date)
      };
    });
  } catch (error) {
    throw new Error(`Failed to get commits since ${since}: ${error}`);
  }
}

/**
 * Analyze commit messages using conventional commits format
 */
export function analyzeCommits(commits: CommitInfo[]): VersionCalculationResult {
  let hasBreakingChanges = false;
  let hasFeatures = false;
  let hasFixes = false;

  // Conventional commit patterns
  const breakingPattern = /^(\w+)(\(.+\))?!:/;
  const featurePattern = /^feat(\(.+\))?:/;
  const fixPattern = /^fix(\(.+\))?:/;
  const breakingBodyPattern = /BREAKING CHANGE:/i;

  for (const commit of commits) {
    const fullMessage = `${commit.subject}\n${commit.body}`;

    // Check for breaking changes
    if (breakingPattern.test(commit.subject) || breakingBodyPattern.test(fullMessage)) {
      hasBreakingChanges = true;
    }

    // Check for features
    if (featurePattern.test(commit.subject)) {
      hasFeatures = true;
    }

    // Check for fixes
    if (fixPattern.test(commit.subject)) {
      hasFixes = true;
    }
  }

  // Determine version type
  let suggestedType: VersionType;
  let reason: string;

  if (hasBreakingChanges) {
    suggestedType = 'major';
    reason = 'Breaking changes detected in commits';
  } else if (hasFeatures) {
    suggestedType = 'minor';
    reason = 'New features detected in commits';
  } else if (hasFixes) {
    suggestedType = 'patch';
    reason = 'Bug fixes detected in commits';
  } else if (commits.length > 0) {
    suggestedType = 'patch';
    reason = 'Changes detected but no conventional commit types found';
  } else {
    suggestedType = 'patch';
    reason = 'No commits since last tag';
  }

  return {
    suggestedType,
    reason,
    commits,
    hasBreakingChanges,
    hasFeatures,
    hasFixes
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
      const totalCommits = parseInt(stdout.trim(), 10);
      const limit = Math.min(totalCommits, 50);
      const { stdout: commitStdout } = await execAsync(
        `git log -${limit} --pretty=format:"%H|||%s|||%b|||%an|||%ad" --date=iso`
      );

      const commitLines = commitStdout.trim().split('\n').filter(Boolean);
      const commits = commitLines.map(line => {
        const [hash, subject, body, author, date] = line.split('|||');
        return {
          hash,
          subject,
          body: body || '',
          author,
          date: new Date(date)
        };
      });

      const result = analyzeCommits(commits);
      console.log(`📊 Analyzed ${commits.length} commits (no previous tags)`);
      return result;
    } catch (error) {
      throw new Error(`Failed to analyze commits: ${error}`);
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
        console.log(`   - ${commit.subject.substring(0, 50)}... (${commit.hash.substring(0, 7)})`);
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
