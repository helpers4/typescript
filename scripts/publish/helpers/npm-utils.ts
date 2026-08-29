/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { exec, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'fs-extra';
import path from 'node:path';

const execAsync = promisify(exec);

export interface PublishOptions {
  access?: 'public' | 'restricted';
  tag?: string;
  dryRun?: boolean;
  registry?: string;
  provenance?: boolean;
  retries?: number;
  retryDelay?: number;
}

export interface PublishResult {
  packageName: string;
  version: string;
  success: boolean;
  error?: Error;
  skipped?: boolean;
  skipReason?: string;
}

/**
 * Check if NPM is authenticated
 */
export async function checkNpmAuth(): Promise<boolean> {
  try {
    await execAsync('npm whoami');
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a package version already exists
 */
export async function packageVersionExists(packageName: string, version: string): Promise<boolean> {
  try {
    const { stdout } = await execAsync(`npm view ${packageName}@${version} version --silent`);
    return stdout.trim() === version;
  } catch {
    // Package or version doesn't exist
    return false;
  }
}

/**
 * Get package info from package.json
 */
export async function getPackageInfo(packagePath: string): Promise<{ name: string; version: string }> {
  const packageJsonPath = path.join(packagePath, 'package.json');

  if (!await fs.pathExists(packageJsonPath)) {
    throw new Error(`package.json not found at ${packageJsonPath}`);
  }

  const packageJson = await fs.readJson(packageJsonPath);

  if (!packageJson.name) {
    throw new Error(`Package name not found in ${packageJsonPath}`);
  }

  if (!packageJson.version) {
    throw new Error(`Package version not found in ${packageJsonPath}`);
  }

  return {
    name: packageJson.name,
    version: packageJson.version
  };
}

/**
 * Publish a single package with retry logic
 */
export async function publishPackage(
  packagePath: string,
  options: PublishOptions = {}
): Promise<PublishResult> {
  const {
    access = 'public',
    tag = 'latest',
    dryRun = false,
    registry,
    provenance = false,
    retries = 3,
    retryDelay = 5000
  } = options;

  try {
    const packageInfo = await getPackageInfo(packagePath);

    // Check if version already exists
    const exists = await packageVersionExists(packageInfo.name, packageInfo.version);
    if (exists) {
      return {
        packageName: packageInfo.name,
        skipReason: 'Version already published',
        skipped: true,
        success: true,
        version: packageInfo.version
      };
    }

    // Build npm command
    const commands = ['npm', 'publish'];

    if (dryRun) {
      commands.push('--dry-run');
    }

    if (access) {
      commands.push('--access', access);
    }

    if (tag) {
      commands.push('--tag', tag);
    }

    if (registry) {
      commands.push('--registry', registry);
    }

    if (provenance) {
      commands.push('--provenance');
    }

    const command = commands.join(' ');

    // Retry logic
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`📦 Publishing ${packageInfo.name}@${packageInfo.version} (attempt ${attempt}/${retries})`);

        if (dryRun) {
          console.log(`[DRY RUN] Would execute: ${command}`);
        } else {
          const { stdout, stderr } = await execAsync(command, {
            cwd: packagePath,
            timeout: 120_000 // 2 minutes timeout
          });

          if (stderr && !stderr.includes('npm notice')) {
            console.warn(`Warning during publish: ${stderr}`);
          }

          if (stdout) {
            console.log(stdout);
          }
        }

        return {
          packageName: packageInfo.name,
          success: true,
          version: packageInfo.version
        };

      } catch (error) {
        lastError = error as Error;
        console.error(`❌ Publish attempt ${attempt} failed for ${packageInfo.name}:`, error);

        if (attempt < retries) {
          console.log(`⏳ Waiting ${retryDelay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    return {
      error: lastError || new Error('Unknown publish error'),
      packageName: packageInfo.name,
      success: false,
      version: packageInfo.version
    };

  } catch (error) {
    return {
      error: error as Error,
      packageName: 'unknown',
      success: false,
      version: 'unknown'
    };
  }
}

export interface UnpublishOptions {
  registry?: string;
  otp?: string;
  dryRun?: boolean;
}

export interface UnpublishResult {
  packageName: string;
  version: string;
  success: boolean;
  error?: Error;
  skipped?: boolean;
  skipReason?: string;
}

/**
 * Unpublish a single package version.
 *
 * Runs `npm unpublish` with `stdio: 'inherit'` (not the `exec`-based approach `publishPackage`
 * uses) so that if the npm account has 2FA enabled, npm's own "Enter OTP:" prompt reaches the
 * real terminal and the typed response reaches npm — an `exec`'d child process has no TTY, so
 * that prompt would otherwise hang forever with no visible way to answer it. Pass `otp` to
 * skip the prompt entirely when a valid one-time code is already on hand.
 */
export async function unpublishPackage(
  packageName: string,
  version: string,
  options: UnpublishOptions = {}
): Promise<UnpublishResult> {
  const { registry, otp, dryRun = false } = options;

  const exists = await packageVersionExists(packageName, version);
  if (!exists) {
    return {
      packageName,
      version,
      success: true,
      skipped: true,
      skipReason: 'Version not published, nothing to unpublish'
    };
  }

  const args = ['unpublish', `${packageName}@${version}`];
  if (registry) {
    args.push('--registry', registry);
  }
  if (otp) {
    args.push('--otp', otp);
  }

  if (dryRun) {
    console.log(`[DRY RUN] Would run: npm ${args.join(' ')}`);
    return { packageName, version, success: true, skipped: true, skipReason: 'dry-run' };
  }

  console.log(`🗑️  Unpublishing ${packageName}@${version}...`);

  return new Promise((resolve) => {
    const child = spawn('npm', args, { stdio: 'inherit' });

    child.on('error', (error) => {
      resolve({ packageName, version, success: false, error });
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ packageName, version, success: true });
      } else {
        resolve({
          packageName,
          version,
          success: false,
          error: new Error(`npm unpublish exited with code ${code}`)
        });
      }
    });
  });
}

/**
 * Deprecate a package version
 */
export async function deprecatePackage(
  packageName: string,
  version: string,
  message: string = 'Deprecated due to release failure'
): Promise<boolean> {
  try {
    console.log(`⏪ Deprecating ${packageName}@${version}...`);
    await execAsync(`npm deprecate ${packageName}@${version} "${message}"`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to deprecate ${packageName}@${version}:`, error);
    return false;
  }
}
