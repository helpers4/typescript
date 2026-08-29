#!/usr/bin/env node

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { DIR } from '../constants';
import { listHelperCategories } from '../utils';
import type { UnpublishResult } from './helpers/npm-utils';
import { unpublishPackage } from './helpers/npm-utils';

interface UnpublishConfig {
  version: string;
  registry?: string;
  otp?: string;
  dryRun: boolean;
}

/**
 * Parse command line arguments
 */
function parseArgs(): UnpublishConfig {
  const args = process.argv.slice(2);

  const config: Partial<UnpublishConfig> = {
    dryRun: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    // Allow the version as a bare positional argument too: `unpublish-version.ts 3.0.8`.
    // Handled ahead of the switch so a conflicting --version further along (or a second
    // positional argument) is a clear error instead of one silently overwriting the other.
    if (!arg.startsWith('--')) {
      if (config.version) {
        console.error(`Unexpected extra argument "${arg}" — version is already set to "${config.version}".`);
        process.exit(1);
      }
      config.version = arg;
      continue;
    }

    switch (arg) {
      case '--version': {
        if (config.version) {
          console.error(`--version conflicts with the version already given ("${config.version}").`);
          process.exit(1);
        }
        config.version = args[++i];
        break;
      }
      case '--registry': {
        config.registry = args[++i];
        break;
      }
      case '--otp': {
        config.otp = args[++i];
        break;
      }
      case '--dry-run': {
        config.dryRun = true;
        break;
      }
      case '--help': {
        printHelp();
        process.exit(0);
      }
      default: {
        console.error(`Unknown argument: ${arg}`);
        process.exit(1);
      }
    }
  }

  if (!config.version) {
    console.error('Missing required version.\n');
    printHelp();
    process.exit(1);
  }

  return config as UnpublishConfig;
}

/**
 * Print help information
 */
function printHelp(): void {
  console.log(`
Usage: pnpm exec tsx scripts/publish/unpublish-version.ts <version> [options]

Best-effort unpublish of every @helpers4/* package (every category plus the
@helpers4/all bundle) at a specific version — meant to clean up after a
release that failed partway through, publishing some packages but not
others. A package that was never published at that version is skipped, not
treated as a failure. A package that fails to unpublish is logged and
skipped too — this tool never stops partway through.

If the npm account has 2FA enabled, npm's own "Enter OTP:" prompt appears
directly in this terminal for each package that needs it (unless --otp is
given). Answer it the same way you would for a manual "npm unpublish".

Options:
  --version <version>    Version to unpublish (e.g. 3.0.8) — can also be given positionally
  --registry <url>       Custom NPM registry
  --otp <code>           One-time password, passed to every npm unpublish call
  --dry-run              Print what would be unpublished, without doing it
  --help                 Show this help message

Examples:
  pnpm exec tsx scripts/publish/unpublish-version.ts 3.0.8
  pnpm exec tsx scripts/publish/unpublish-version.ts --version 3.0.8 --dry-run
  pnpm exec tsx scripts/publish/unpublish-version.ts 3.0.8 --otp 123456
`);
}

/**
 * Unpublish a specific version across every category package and the bundle package,
 * ignoring per-package failures so the run always covers every package.
 */
async function unpublishVersion(config: UnpublishConfig): Promise<UnpublishResult[]> {
  const categories = await listHelperCategories(DIR.HELPERS);
  const packageNames = [...categories.map((category) => `@helpers4/${category}`), '@helpers4/all'];

  console.log(`🗑️  Unpublishing version ${config.version} for ${packageNames.length} package(s)...\n`);
  if (config.dryRun) {
    console.log('🧪 DRY RUN MODE — nothing will actually be unpublished\n');
  }

  const results: UnpublishResult[] = [];

  for (const packageName of packageNames) {
    // Intentionally not wrapped in try/catch beyond what unpublishPackage() already does —
    // it never throws, always resolves to a result object, so a failure here can't abort
    // the loop. That's the whole point: keep going regardless of what happened to this package.
    const result = await unpublishPackage(packageName, config.version, {
      registry: config.registry,
      otp: config.otp,
      dryRun: config.dryRun
    });
    results.push(result);

    if (result.skipped) {
      console.log(`⏭️  Skipped ${packageName}@${config.version}: ${result.skipReason}\n`);
    } else if (result.success) {
      console.log(`✅ Unpublished ${packageName}@${config.version}\n`);
    } else {
      console.error(`❌ Failed to unpublish ${packageName}@${config.version}: ${result.error?.message}\n`);
    }
  }

  const unpublished = results.filter((r) => r.success && !r.skipped).length;
  const skipped = results.filter((r) => r.skipped).length;
  const failed = results.filter((r) => !r.success);

  console.log('='.repeat(60));
  console.log('📊 UNPUBLISH SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Unpublished: ${unpublished}`);
  console.log(`⏭️  Skipped (not published at this version): ${skipped}`);
  console.log(`❌ Failed (ignored, run again to retry just these): ${failed.length}`);

  if (failed.length > 0) {
    console.log('\nFailed packages:');
    for (const r of failed) {
      console.log(`   - ${r.packageName}@${r.version}: ${r.error?.message}`);
    }
  }

  return results;
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  const config = parseArgs();
  await unpublishVersion(config);
}

// Run if called directly
if (import.meta.url.endsWith(process.argv[1])) {
  main().catch((error) => {
    console.error('\n❌ Unpublish run crashed:', error instanceof Error ? error.message : error);
    process.exit(1);
  });
}

export { parseArgs, unpublishVersion };
