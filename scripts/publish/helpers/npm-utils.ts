/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { exec, execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'fs-extra';
import path from 'node:path';

const execAsync = promisify(exec);
const execFileAsync = promisify(execFile);

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
 * Check if a package version already exists.
 *
 * Uses `execFile` (argument array, no shell) rather than `exec` (a command string run through a
 * shell) — `packageName`/`version` used to be interpolated into a shell command string here,
 * which was harmless while every caller sourced `version` from a trusted `package.json`, but
 * became a real command-injection risk once `unpublish-version.ts` started passing an
 * unvalidated CLI argument straight through this same path.
 */
export async function packageVersionExists(packageName: string, version: string): Promise<boolean> {
  try {
    const { stdout } = await execFileAsync('npm', ['view', `${packageName}@${version}`, 'version', '--silent']);
    return stdout.trim() === version;
  } catch {
    // Package or version doesn't exist
    return false;
  }
}

/**
 * Fetch npm's per-version publish-time map for a package (the `time` field of `npm view
 * --json`), or `null` if the package has never been published under this name at all.
 *
 * Every version that has ever existed — including ones later removed via `npm unpublish` —
 * has a tombstone entry here, unlike `versions`, which only lists what's currently
 * installable. Shared by {@link packageVersionEverPublished} (does this exact version have an
 * entry?) and {@link packageExistsOnRegistry} (did the lookup itself succeed at all?). A caller
 * needing both facts about the same package — as `validatePackages` in `scripts/publish/index.ts`
 * does — should call this directly once instead of calling both of those and hitting the
 * registry twice for the same package.
 */
export async function getPackagePublishTimes(packageName: string): Promise<Record<string, string> | null> {
  try {
    const { stdout } = await execFileAsync('npm', ['view', packageName, 'time', '--json', '--silent']);
    return JSON.parse(stdout) as Record<string, string>;
  } catch {
    // Package doesn't exist yet, or has no time data
    return null;
  }
}

/**
 * Check if a version was ever published for a package, even if it was later unpublished.
 *
 * This matters because npm permanently refuses to publish over a version number that was
 * once published and then unpublished (`E400 Cannot publish over previously published
 * version`), even long after the unpublish. `packageVersionExists` alone can't see this: it
 * returns `false` for an unpublished version, which looks identical to "never published"
 * right up until the real `npm publish` call fails.
 */
export async function packageVersionEverPublished(packageName: string, version: string): Promise<boolean> {
  const times = await getPackagePublishTimes(packageName);
  return times !== null && version in times;
}

/**
 * Check whether a package has ever been published at all, under any version.
 *
 * Distinct from {@link packageVersionExists} (checks one specific version) — this exists to
 * catch a brand-new package *before* a release attempts to publish it: this repo's release
 * workflow authenticates to npm via Trusted Publishing (OIDC, `--provenance`, no static
 * NPM_TOKEN — see `.github/workflows/release.yml`), and npm Trusted Publishing can only be
 * configured for a package that already exists on the registry. A never-published package
 * (e.g. a newly-added category) has no trusted publisher configured yet, so `npm publish`
 * fails with a permission error for that package alone, mid-batch, while every
 * already-existing package in the same release succeeds. Bootstrapping it — one manual
 * publish (e.g. `npx --yes setup-npm-trusted-publish <name>`) followed by adding this repo's
 * workflow as a trusted publisher on npmjs.com — has to happen before the first automated
 * release of a new package, not be discovered by that release failing.
 *
 * Needing this and {@link packageVersionEverPublished} for the same package? Call
 * {@link getPackagePublishTimes} once directly instead — that's what both of these are built
 * on, and calling them separately would hit the registry twice for the same package.
 */
export async function packageExistsOnRegistry(packageName: string): Promise<boolean> {
  return (await getPackagePublishTimes(packageName)) !== null;
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

/** Same shape as {@link PublishResult} — an npm-operation outcome doesn't vary by which operation it was. */
export type UnpublishResult = PublishResult;

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
