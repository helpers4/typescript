#!/usr/bin/env node

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import fs from 'fs-extra';
import path from 'path';
import { calculateVersionFromCommits, promptVersionType, VersionType } from './commit-analyzer';

interface VersionComponents {
  major: number;
  minor: number;
  patch: number;
  prerelease?: {
    type: 'alpha' | 'beta' | 'rc';
    version: number;
  };
}

interface VersionUpdateOptions {
  versionType?: VersionType;
  rootPath?: string;
  autoCalculate?: boolean;
  updateBuildPackages?: boolean;
  dryRun?: boolean;
}

/**
 * Parse version string into components
 */
function parseVersion(version: string): VersionComponents {
  const prereleaseMatch = version.match(/^(\d+)\.(\d+)\.(\d+)-(\w+)\.(\d+)$/);
  if (prereleaseMatch) {
    return {
      major: parseInt(prereleaseMatch[1], 10),
      minor: parseInt(prereleaseMatch[2], 10),
      patch: parseInt(prereleaseMatch[3], 10),
      prerelease: {
        type: prereleaseMatch[4] as 'alpha' | 'beta' | 'rc',
        version: parseInt(prereleaseMatch[5], 10)
      }
    };
  }

  const stableMatch = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (stableMatch) {
    return {
      major: parseInt(stableMatch[1], 10),
      minor: parseInt(stableMatch[2], 10),
      patch: parseInt(stableMatch[3], 10)
    };
  }

  throw new Error(`Invalid version format: ${version}`);
}

/**
 * Convert version components back to string
 */
function stringifyVersion(components: VersionComponents): string {
  const base = `${components.major}.${components.minor}.${components.patch}`;
  if (components.prerelease) {
    return `${base}-${components.prerelease.type}.${components.prerelease.version}`;
  }
  return base;
}

/**
 * Increment version based on type
 */
function incrementVersion(currentVersion: string, versionType: VersionType): string {
  const components = parseVersion(currentVersion);

  switch (versionType) {
    case 'major':
      components.major++;
      components.minor = 0;
      components.patch = 0;
      delete components.prerelease;
      break;

    case 'minor':
      components.minor++;
      components.patch = 0;
      delete components.prerelease;
      break;

    case 'patch':
      if (components.prerelease) {
        // Remove prerelease for patch bump
        delete components.prerelease;
      } else {
        components.patch++;
      }
      break;

    case 'prerelease':
      if (components.prerelease) {
        // Increment existing prerelease
        components.prerelease.version++;
      } else {
        // Add new prerelease
        components.prerelease = {
          type: 'alpha',
          version: 0
        };
      }
      break;

    default:
      throw new Error(`Invalid version type: ${versionType}`);
  }

  return stringifyVersion(components);
}

/**
 * Update version in package.json
 */
export async function updatePackageVersion(
  packagePath: string,
  newVersion: string,
  dryRun: boolean = false
): Promise<void> {
  const packageJsonPath = path.join(packagePath, 'package.json');

  if (!await fs.pathExists(packageJsonPath)) {
    throw new Error(`package.json not found at ${packageJsonPath}`);
  }

  const packageJson = await fs.readJson(packageJsonPath);
  const oldVersion = packageJson.version;

  if (oldVersion === newVersion) {
    console.log(`⏭️  ${packageJson.name || 'package'}: version unchanged (${newVersion})`);
    return;
  }

  if (!dryRun) {
    packageJson.version = newVersion;
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  }

  console.log(`${dryRun ? '[DRY RUN] ' : ''}✅ ${packageJson.name || 'package'}: ${oldVersion} → ${newVersion}`);
}

/**
 * Determine version type to use
 */
async function determineVersionType(options: VersionUpdateOptions): Promise<VersionType> {
  // If version type is explicitly provided, use it
  if (options.versionType) {
    console.log(`🎯 Using explicit version type: ${options.versionType}`);
    return options.versionType;
  }

  // If auto-calculate is enabled, analyze commits
  if (options.autoCalculate) {
    console.log('🤖 Auto-calculating version type from git history...');
    const analysis = await calculateVersionFromCommits();

    // Allow user to confirm or override (in interactive mode)
    const finalType = await promptVersionType(analysis.suggestedType);

    if (finalType !== analysis.suggestedType) {
      console.log(`👤 User overrode suggestion: ${analysis.suggestedType} → ${finalType}`);
    }

    return finalType;
  }

  // Default fallback
  throw new Error('Version type must be provided or auto-calculation must be enabled');
}

/**
 * Update version in all packages
 */
export async function updateAllPackageVersions(options: VersionUpdateOptions): Promise<{
  newVersion: string;
  oldVersion: string;
  versionType: VersionType;
}> {
  const {
    rootPath = process.cwd(),
    updateBuildPackages = true,
    dryRun = false
  } = options;

  if (dryRun) {
    console.log('🧪 DRY RUN MODE - No files will be modified\n');
  }

  console.log(`🔄 Updating package versions...`);

  // Determine version type
  const versionType = await determineVersionType(options);

  // Read root package.json
  const rootPackageJsonPath = path.join(rootPath, 'package.json');
  if (!await fs.pathExists(rootPackageJsonPath)) {
    throw new Error(`Root package.json not found at ${rootPackageJsonPath}`);
  }

  const rootPackageJson = await fs.readJson(rootPackageJsonPath);
  const currentVersion = rootPackageJson.version;

  if (!currentVersion) {
    throw new Error('Version not found in root package.json');
  }

  console.log(`📌 Current version: ${currentVersion}`);
  console.log(`🎯 Version type: ${versionType}`);

  // Calculate new version
  const newVersion = incrementVersion(currentVersion, versionType);
  console.log(`🎯 New version: ${newVersion}\n`);

  // Update root package.json
  console.log('📦 Updating root package...');
  await updatePackageVersion(rootPath, newVersion, dryRun);

  // Update build packages if they exist and requested
  if (updateBuildPackages) {
    const buildDir = path.join(rootPath, 'build');
    if (await fs.pathExists(buildDir)) {
      console.log('\n📦 Updating build packages...');
      const buildDirs = await fs.readdir(buildDir);

      let updatedCount = 0;
      for (const dir of buildDirs) {
        const packagePath = path.join(buildDir, dir);
        const packageJsonPath = path.join(packagePath, 'package.json');

        if (await fs.pathExists(packageJsonPath)) {
          await updatePackageVersion(packagePath, newVersion, dryRun);
          updatedCount++;
        }
      }

      console.log(`\n📊 Updated ${updatedCount} build packages`);
    } else {
      console.log('\n⚠️  Build directory not found - skipping build packages');
    }
  }

  if (dryRun) {
    console.log('\n🧪 DRY RUN completed - no files were modified');
  } else {
    console.log(`\n✅ All packages updated to version ${newVersion}`);
  }

  return {
    newVersion,
    oldVersion: currentVersion,
    versionType
  };
}

/**
 * Parse command line arguments
 */
function parseArgs(): VersionUpdateOptions & { help?: boolean } {
  const args = process.argv.slice(2);
  const options: VersionUpdateOptions & { help?: boolean } = {
    autoCalculate: false,
    updateBuildPackages: true,
    dryRun: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case 'major':
      case 'minor':
      case 'patch':
      case 'prerelease':
        if (!options.versionType) {
          options.versionType = arg as VersionType;
        } else {
          console.error('Version type already specified');
          process.exit(1);
        }
        break;
      case '--auto':
      case '--auto-calculate':
        options.autoCalculate = true;
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--no-build':
        options.updateBuildPackages = false;
        break;
      case '--root':
        options.rootPath = path.resolve(args[++i]);
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      default:
        console.error(`Unknown argument: ${arg}`);
        process.exit(1);
    }
  }

  return options;
}

/**
 * Print help information
 */
function printHelp(): void {
  console.log(`
Version Manager - Automatic version calculation and updating

Usage: 
  pnpm exec tsx version-manager.ts <version-type>     # Explicit version type
  pnpm exec tsx version-manager.ts --auto             # Auto-calculate from commits
  
Version Types:
  major          Increment major version (1.0.0 → 2.0.0)
  minor          Increment minor version (1.0.0 → 1.1.0) 
  patch          Increment patch version (1.0.0 → 1.0.1)
  prerelease     Increment or add prerelease (1.0.0 → 1.0.1-alpha.0)

Options:
  --auto, --auto-calculate    Calculate version type from git commits
  --dry-run                   Show what would be changed without modifying files
  --no-build                  Don't update build package versions
  --root <path>               Specify root directory (default: current directory)
  --help, -h                  Show this help message

Examples:
  pnpm exec tsx version-manager.ts patch              # Explicit patch version
  pnpm exec tsx version-manager.ts --auto             # Calculate from commits
  pnpm exec tsx version-manager.ts --auto --dry-run   # Preview auto-calculated changes
  
Auto-calculation uses conventional commits:
  - feat: ... → minor version
  - fix: ... → patch version  
  - feat!: ... or BREAKING CHANGE → major version
  - No conventional commits → patch version
`);
}

// CLI usage
if (import.meta.url.endsWith(process.argv[1])) {
  const options = parseArgs();

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  // Validate options
  if (!options.versionType && !options.autoCalculate) {
    console.error('❌ Either specify a version type or use --auto for automatic calculation');
    console.error('Use --help for usage information');
    process.exit(1);
  }

  if (options.versionType && options.autoCalculate) {
    console.error('❌ Cannot use both explicit version type and auto-calculation');
    process.exit(1);
  }

  updateAllPackageVersions(options)
    .then(result => {
      if (options.dryRun) {
        console.log(result.newVersion);
      } else {
        console.log(`\n🎉 Version update completed!`);
        console.log(`📦 ${result.oldVersion} → ${result.newVersion} (${result.versionType})`);
      }
    })
    .catch(error => {
      console.error('\n❌ Version update failed:');
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    });
}