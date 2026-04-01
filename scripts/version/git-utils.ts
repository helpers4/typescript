#!/usr/bin/env node

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface GitCommitOptions {
  message: string;
  files?: string[];
  pushBranch?: string;
}

/**
 * Execute git commands for version commit
 */
export async function createVersionCommitAndTag(options: GitCommitOptions): Promise<void> {
  console.log('📝 Creating version commit...');

  try {
    // Add files to git
    const filesToAdd = options.files || ['package.json', 'build/'];
    for (const file of filesToAdd) {
      console.log(`📁 Adding ${file} to git...`);
      await execAsync(`git add ${file}`);
    }

    // Check if there are changes to commit
    const { stdout: statusOutput } = await execAsync('git status --porcelain');
    if (statusOutput.trim() === '') {
      console.log('📝 No changes to commit');
      return;
    }

    // Create commit
    console.log(`💾 Creating commit: ${options.message}`);
    await execAsync(`git commit -m "${options.message}"`);

    // Push branch if specified
    if (options.pushBranch) {
      console.log(`🚀 Pushing to branch: ${options.pushBranch}`);
      await execAsync(`git push origin ${options.pushBranch}`);
    }

    console.log('✅ Git operations completed successfully');
  } catch (error) {
    console.error('❌ Git operations failed:', error);
    throw error;
  }
}

/**
 * Get current git branch
 */
export async function getCurrentBranch(): Promise<string> {
  try {
    const { stdout } = await execAsync('git branch --show-current');
    return stdout.trim();
  } catch (error) {
    console.error('❌ Failed to get current branch:', error);
    throw error;
  }
}

/**
 * Check if working directory is clean
 */
export async function isWorkingDirectoryClean(): Promise<boolean> {
  try {
    const { stdout } = await execAsync('git status --porcelain');
    return stdout.trim() === '';
  } catch (error) {
    console.error('❌ Failed to check git status:', error);
    throw error;
  }
}

/**
 * Get the latest git tag
 */
export async function getLatestTag(): Promise<string | null> {
  try {
    const { stdout } = await execAsync('git describe --tags --abbrev=0');
    return stdout.trim();
  } catch {
    // No tags found
    return null;
  }
}

// CLI usage
if (import.meta.url.endsWith(process.argv[1])) {
  const action = process.argv[2];

  switch (action) {
    case 'current-branch':
      getCurrentBranch().then(console.log).catch(console.error);
      break;

    case 'is-clean':
      isWorkingDirectoryClean().then(clean => {
        console.log(clean ? 'Clean' : 'Dirty');
        process.exit(clean ? 0 : 1);
      }).catch(console.error);
      break;

    case 'latest-tag':
      getLatestTag().then(tag => {
        console.log(tag || 'No tags found');
      }).catch(console.error);
      break;

    default:
      console.error('Usage: pnpm exec tsx git-utils.ts <current-branch|is-clean|latest-tag>');
      process.exit(1);
  }
}
