#!/usr/bin/env node

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { updateAllPackageVersions } from './version-manager';
import { injectSinceVersion, isPrerelease } from './inject-since';
import { createVersionCommitAndTag, getCurrentBranch, isWorkingDirectoryClean } from './git-utils';
import type { VersionType } from './commit-analyzer';

const execAsync = promisify(exec);

interface ReleaseOptions {
  versionType?: VersionType;
  autoCalculate?: boolean;
  branch?: string;
  dryRun?: boolean;
  skipTests?: boolean;
  skipBuild?: boolean;
  skipCoherency?: boolean;
  skipPublish?: boolean;
}

/**
 * Main release orchestrator
 */
export async function performRelease(options: ReleaseOptions): Promise<void> {
  console.log('🚀 Starting release process...');
  console.log(`📋 Options:`, options);

  try {
    // Step 1: Pre-checks
    console.log('\n📋 Step 1: Pre-flight checks');

    if (!options.dryRun) {
      const isClean = await isWorkingDirectoryClean();
      if (!isClean) {
        throw new Error('Working directory is not clean. Please commit or stash your changes.');
      }
    }

    const currentBranch = await getCurrentBranch();
    const targetBranch = options.branch || currentBranch;
    console.log(`🌿 Target branch: ${targetBranch}`);

    if (!options.dryRun && currentBranch !== targetBranch) {
      console.log(`🔄 Switching to branch: ${targetBranch}`);
      await execAsync(`git checkout ${targetBranch}`);
    }

    // Step 2: Run tests
    if (!options.skipTests) {
      console.log('\n🧪 Step 2: Running tests');
      if (!options.dryRun) {
        await execAsync('pnpm test');
      }
      console.log('✅ Tests passed');
    } else {
      console.log('\n⏭️  Step 2: Skipping tests');
    }

    // Step 3: Update version
    console.log('\n🔢 Step 3: Updating version');
    let newVersion: string;

    if (!options.dryRun) {
      const updateOptions = options.autoCalculate
        ? { autoCalculate: true, dryRun: false }
        : { dryRun: false, versionType: options.versionType };

      const result = await updateAllPackageVersions(updateOptions);
      ({ newVersion } = result);
    } else {
      // Simulate version calculation for dry run
      const fs = await import('fs-extra');
      const packageJson = await fs.readJson('./package.json');
      const typeInfo = options.autoCalculate ? 'auto-calculated' : options.versionType;
      console.log(`[DRY RUN] Would update version from ${packageJson.version} (${typeInfo})`);
      newVersion = 'x.x.x-dry-run';
    }

    const releaseTag = `v${newVersion}`;
    const stableRelease = !isPrerelease(newVersion);

    // Step 3b: Inject @since next → @since <version> (stable releases only)
    if (stableRelease) {
      if (!options.dryRun) {
        await injectSinceVersion(newVersion);
      } else {
        console.log(`[DRY RUN] Would inject @since ${newVersion} into helper files with @since next`);
      }
    } else {
      console.log(`\n🔖 Step 3b: Skipping @since injection — prerelease (${newVersion}), keeping @since next`);
    }

    // Step 4: Generate changelog
    console.log('\n📋 Step 4: Generating changelog');
    if (!options.dryRun) {
      await execAsync(`pnpm run changelog -- --tag ${releaseTag}`);
    } else {
      console.log(`[DRY RUN] Would regenerate CHANGELOG.md for ${releaseTag}`);
    }
    console.log('✅ Changelog generated');

    // Step 5: Build packages
    if (!options.skipBuild) {
      console.log('\n🏗️  Step 5: Building packages');
      if (!options.dryRun) {
        await execAsync('pnpm run build');
      }
      console.log('✅ Build completed');
    } else {
      console.log('\n⏭️  Step 5: Skipping build');
    }

    // Step 6: Run coherency tests
    if (!options.skipCoherency) {
      console.log('\n🔍 Step 6: Running coherency tests');
      if (!options.dryRun) {
        await execAsync('pnpm run coherency');
      }
      console.log('✅ Coherency tests passed');
    } else {
      console.log('\n⏭️  Step 6: Skipping coherency tests');
    }

    // Step 7: Create commit and push
    // Tags are created by the CI workflow via the GitHub API (verified signatures)
    console.log('\n📝 Step 7: Creating version commit');
    if (!options.dryRun) {
      await createVersionCommitAndTag({
        files: [
          'package.json',
          'build/',
          'CHANGELOG.md',
          ...(stableRelease ? ['helpers/'] : []),
        ],
        message: `chore: release v${newVersion}`,
        pushBranch: targetBranch
      });
    } else {
      console.log(`[DRY RUN] Would create commit for v${newVersion}`);
    }

    // Step 8: Publish packages
    if (!options.skipPublish) {
      console.log('\n📦 Step 8: Publishing packages');
      if (!options.dryRun) {
        await execAsync('pnpm run publish:packages');
      } else {
        console.log('[DRY RUN] Would publish packages to NPM');
      }
      console.log('✅ Packages published');
    } else {
      console.log('\n⏭️  Step 8: Skipping publish');
    }

    console.log('\n🎉 Release process completed successfully!');
    if (!options.dryRun) {
      console.log(`📦 Version: ${newVersion}`);
      console.log(`🌿 Branch: ${targetBranch}`);
    }

  } catch (error) {
    console.error('\n💥 Release process failed:', error);

    if (!options.dryRun) {
      console.log('\n🔄 Consider running in dry-run mode first: --dry-run');
      console.log('🧹 You may need to clean up manually:');
      console.log('   - Revert version changes: git checkout HEAD -- package.json');
      console.log('   - Remove created tag: git tag -d v<version>');
      console.log('   - Reset uncommitted changes: git reset --hard HEAD~1');
    }

    process.exit(1);
  }
}

// CLI usage
if (import.meta.url.endsWith(process.argv[1])) {
  const args = process.argv.slice(2);

  // Check for auto-calculate mode
  const autoCalculate = args.includes('--auto') || args.includes('--auto-calculate');

  let versionType: VersionType | undefined;
  if (!autoCalculate) {
    versionType = args[0] as VersionType;

    if (!versionType || !['major', 'minor', 'patch', 'prerelease'].includes(versionType)) {
      console.error('Usage: pnpm exec tsx release.ts <major|minor|patch|prerelease|--auto> [options]');
      console.error('');
      console.error('Version Types:');
      console.error('  major          : Breaking changes (1.0.0 → 2.0.0)');
      console.error('  minor          : New features (1.0.0 → 1.1.0)');
      console.error('  patch          : Bug fixes (1.0.0 → 1.0.1)');
      console.error('  prerelease     : Alpha/Beta (1.0.0 → 1.0.1-alpha.0)');
      console.error('  --auto         : Auto-calculate from git commits');
      console.error('');
      console.error('Options:');
      console.error('  --dry-run       : Simulate the release process without making changes');
      console.error('  --branch <name> : Target branch (default: current branch)');
      console.error('  --skip-tests    : Skip running tests');
      console.error('  --skip-build    : Skip building packages');
      console.error('  --skip-coherency: Skip coherency tests');
      console.error('  --skip-publish  : Skip publishing to NPM');
      console.error('');
      console.error('Examples:');
      console.error('  pnpm exec tsx release.ts patch           # Patch release');
      console.error('  pnpm exec tsx release.ts --auto          # Auto-calculate from commits');
      console.error('  pnpm exec tsx release.ts minor --dry-run # Test minor release');
      process.exit(1);
    }
  }

  const options: ReleaseOptions = {
    autoCalculate,
    dryRun: args.includes('--dry-run'),
    skipBuild: args.includes('--skip-build'),
    skipCoherency: args.includes('--skip-coherency'),
    skipPublish: args.includes('--skip-publish'),
    skipTests: args.includes('--skip-tests'),
    versionType,
  };

  const branchIndex = args.indexOf('--branch');
  if (branchIndex !== -1 && args[branchIndex + 1]) {
    options.branch = args[branchIndex + 1];
  }

  performRelease(options).catch(console.error);
}
