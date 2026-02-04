#!/usr/bin/env node

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import path from 'path';
import {
  checkNpmAuth,
  publishPackage,
  PublishOptions,
  PublishResult
} from './helpers/npm-utils';
import {
  discoverPackages,
  groupPackagesByType,
  validatePackageStructure
} from './helpers/package-discovery';
import {
  PublishTransaction,
  withTransaction
} from './helpers/transaction-manager';

interface PublishConfig {
  buildDir: string;
  dryRun: boolean;
  access: 'public' | 'restricted';
  tag: string;
  registry?: string;
  skipValidation: boolean;
  categoryDelay: number; // ms to wait between category and bundle publishing
  retries: number;
  retryDelay: number;
  verbose: boolean;
}

/**
 * Parse command line arguments
 */
function parseArgs(): PublishConfig {
  const args = process.argv.slice(2);

  const config: PublishConfig = {
    buildDir: path.resolve(process.cwd(), 'build'),
    dryRun: false,
    access: 'public',
    tag: 'latest',
    skipValidation: false,
    categoryDelay: 60000, // 60 seconds
    retries: 3,
    retryDelay: 5000, // 5 seconds
    verbose: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--dry-run':
        config.dryRun = true;
        break;
      case '--access':
        config.access = args[++i] as 'public' | 'restricted';
        break;
      case '--tag':
        config.tag = args[++i];
        break;
      case '--registry':
        config.registry = args[++i];
        break;
      case '--skip-validation':
        config.skipValidation = true;
        break;
      case '--category-delay':
        config.categoryDelay = parseInt(args[++i], 10) * 1000; // convert seconds to ms
        break;
      case '--retries':
        config.retries = parseInt(args[++i], 10);
        break;
      case '--retry-delay':
        config.retryDelay = parseInt(args[++i], 10) * 1000; // convert seconds to ms
        break;
      case '--verbose':
        config.verbose = true;
        break;
      case '--build-dir':
        config.buildDir = path.resolve(args[++i]);
        break;
      case '--help':
        printHelp();
        process.exit(0);
      default:
        console.error(`Unknown argument: ${arg}`);
        process.exit(1);
    }
  }

  return config;
}

/**
 * Print help information
 */
function printHelp(): void {
  console.log(`
Usage: pnpm exec tsx scripts/publish/index.ts [options]

Options:
  --dry-run              Simulate publishing without actually publishing
  --access <public|restricted>  Set package access (default: public)
  --tag <tag>            Set the npm tag (default: latest)
  --registry <url>       Set custom npm registry
  --skip-validation      Skip package validation before publishing
  --category-delay <seconds>  Delay between category and bundle publishing (default: 60)
  --retries <number>     Number of retry attempts per package (default: 3)
  --retry-delay <seconds>  Delay between retries (default: 5)
  --build-dir <path>     Custom build directory (default: ./build)
  --verbose              Enable verbose logging
  --help                 Show this help message

Examples:
  pnpm exec tsx scripts/publish/index.ts                    # Publish all packages
  pnpm exec tsx scripts/publish/index.ts --dry-run          # Test publishing
  pnpm exec tsx scripts/publish/index.ts --tag beta         # Publish with beta tag
  pnpm exec tsx scripts/publish/index.ts --category-delay 30  # Wait 30s between category and bundle
`);
}

/**
 * Validate packages before publishing
 */
async function validatePackages(packages: any[], config: PublishConfig): Promise<boolean> {
  if (config.skipValidation) {
    console.log('⏭️  Skipping package validation');
    return true;
  }

  console.log('🔍 Validating packages...');
  let allValid = true;

  for (const pkg of packages) {
    const issues = await validatePackageStructure(pkg.path, pkg.isBundle);

    if (issues.length > 0) {
      console.error(`❌ Validation failed for ${pkg.name}:`);
      issues.forEach(issue => console.error(`   - ${issue}`));
      allValid = false;
    } else if (config.verbose) {
      console.log(`✅ ${pkg.name} validation passed`);
    }
  }

  if (allValid) {
    console.log(`✅ All ${packages.length} packages validated successfully`);
  }

  return allValid;
}

/**
 * Main publishing function
 */
async function publishPackages(config: PublishConfig): Promise<void> {
  const transaction = new PublishTransaction();

  await withTransaction(transaction, async (tx) => {
    console.log('🚀 Starting package publishing process...\n');

    if (config.dryRun) {
      console.log('🧪 DRY RUN MODE - No packages will actually be published\n');
    }

    // Check NPM authentication
    if (!config.dryRun) {
      console.log('🔐 Checking NPM authentication...');
      const isAuthenticated = await checkNpmAuth();
      if (!isAuthenticated) {
        throw new Error('NPM authentication failed. Please login with: npm login');
      }
      console.log('✅ NPM authentication verified\n');
    }

    // Discover packages
    console.log(`📦 Discovering packages in ${config.buildDir}...`);
    const packages = await discoverPackages(config.buildDir);

    if (packages.length === 0) {
      throw new Error('No packages found in build directory. Run build first.');
    }

    console.log(`📋 Found ${packages.length} packages:`);
    packages.forEach(pkg => {
      const type = pkg.isBundle ? 'bundle' : 'category';
      console.log(`   - ${pkg.name}@${pkg.version} (${type})`);
    });

    // Validate packages
    const validationPassed = await validatePackages(packages, config);
    if (!validationPassed) {
      throw new Error('Package validation failed. Fix issues before publishing.');
    }

    // Group packages by type
    const { categories, bundles } = groupPackagesByType(packages);

    console.log(`\n📊 Publishing strategy:`);
    console.log(`   - Categories: ${categories.length} packages`);
    console.log(`   - Bundles: ${bundles.length} packages`);
    console.log(`   - Category delay: ${config.categoryDelay / 1000}s\n`);

    const publishOptions: PublishOptions = {
      access: config.access,
      tag: config.tag,
      registry: config.registry,
      dryRun: config.dryRun,
      retries: config.retries,
      retryDelay: config.retryDelay
    };

    const results: PublishResult[] = [];

    // Phase 1: Publish category packages
    if (categories.length > 0) {
      console.log('📦 Phase 1: Publishing category packages...\n');

      for (const pkg of categories) {
        const result = await publishPackage(pkg.path, publishOptions);
        results.push(result);
        tx.recordPublish(result);

        if (!result.success) {
          throw new Error(`Failed to publish category package: ${result.packageName}`);
        }

        if (result.skipped) {
          console.log(`⏭️  Skipped ${result.packageName}@${result.version}: ${result.skipReason}\n`);
        } else {
          console.log(`✅ Published ${result.packageName}@${result.version}\n`);
        }
      }

      console.log(`✅ All category packages published successfully (${categories.length})\n`);

      // Wait before publishing bundle
      if (bundles.length > 0 && config.categoryDelay > 0) {
        console.log(`⏳ Waiting ${config.categoryDelay / 1000}s before publishing bundle packages...\n`);
        if (!config.dryRun) {
          await new Promise(resolve => setTimeout(resolve, config.categoryDelay));
        }
      }
    }

    // Phase 2: Publish bundle packages
    if (bundles.length > 0) {
      console.log('📦 Phase 2: Publishing bundle packages...\n');

      for (const pkg of bundles) {
        const result = await publishPackage(pkg.path, publishOptions);
        results.push(result);
        tx.recordPublish(result);

        if (!result.success) {
          throw new Error(`Failed to publish bundle package: ${result.packageName}`);
        }

        if (result.skipped) {
          console.log(`⏭️  Skipped ${result.packageName}@${result.version}: ${result.skipReason}\n`);
        } else {
          console.log(`✅ Published ${result.packageName}@${result.version}\n`);
        }
      }

      console.log(`✅ All bundle packages published successfully (${bundles.length})\n`);
    }

    // Print summary
    const successful = results.filter(r => r.success).length;
    const skipped = results.filter(r => r.skipped).length;
    const failed = results.filter(r => !r.success).length;

    console.log('='.repeat(60));
    console.log('📊 PUBLISHING SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successful: ${successful}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`❌ Failed: ${failed}`);

    if (config.dryRun) {
      console.log('\n🧪 DRY RUN completed - no packages were actually published');
    } else {
      console.log('\n🎉 All packages published successfully!');
    }

    const txSummary = tx.getSummary();
    console.log(`⏱️  Total time: ${(txSummary.duration / 1000).toFixed(1)}s`);
  });
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  try {
    const config = parseArgs();

    if (config.verbose) {
      console.log('🔧 Configuration:', JSON.stringify(config, null, 2));
      console.log('');
    }

    await publishPackages(config);

  } catch (error) {
    console.error('\n❌ Publishing failed:');
    console.error(error instanceof Error ? error.message : String(error));

    if (error instanceof Error && error.stack && process.env.DEBUG) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }

    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url.endsWith(process.argv[1])) {
  main().catch(console.error);
}

export { publishPackages, parseArgs };
