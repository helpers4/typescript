#!/usr/bin/env node

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import fs from 'fs-extra';
import path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

interface ValidationResult {
  passed: boolean;
  message: string;
  details?: string;
}

interface ValidationSuite {
  name: string;
  results: ValidationResult[];
}

/**
 * Pre-release validation script
 * Checks that all requirements are met before running a release
 */
class PreReleaseValidator {
  private suites: ValidationSuite[] = [];

  async validate(): Promise<boolean> {
    console.log('🔍 Running pre-release validation...\n');

    // Run all validation suites
    await this.validateEnvironment();
    await this.validateRepository();
    await this.validateDependencies();
    await this.validateScripts();
    await this.validateBuildSystem();

    // Print results
    this.printResults();

    // Return overall status
    return this.suites.every(suite =>
      suite.results.every(result => result.passed)
    );
  }

  private async validateEnvironment(): Promise<void> {
    const suite: ValidationSuite = { name: 'Environment', results: [] };

    // Check Node.js version
    try {
      const { stdout } = await execAsync('node --version');
      const version = stdout.trim();
      suite.results.push({
        message: `Node.js version: ${version}`,
        passed: true
      });
    } catch {
      suite.results.push({
        details: 'Node.js is required for the build process',
        message: 'Node.js not found',
        passed: false
      });
    }

    // Check npm
    try {
      const { stdout } = await execAsync('npm --version');
      const version = stdout.trim();
      suite.results.push({
        message: `npm version: ${version}`,
        passed: true
      });
    } catch {
      suite.results.push({
        details: 'npm is required as the package manager',
        message: 'npm not found',
        passed: false
      });
    }

    // Check Git
    try {
      const { stdout } = await execAsync('git --version');
      const version = stdout.trim();
      suite.results.push({
        message: `Git version: ${version}`,
        passed: true
      });
    } catch {
      suite.results.push({
        details: 'Git is required for version control operations',
        message: 'Git not found',
        passed: false
      });
    }

    this.suites.push(suite);
  }

  private async validateRepository(): Promise<void> {
    const suite: ValidationSuite = { name: 'Repository', results: [] };

    // Check if in git repository
    try {
      await execAsync('git status');
      suite.results.push({
        message: 'Git repository detected',
        passed: true
      });
    } catch {
      suite.results.push({
        details: 'Release process requires a git repository',
        message: 'Not in a git repository',
        passed: false
      });
      this.suites.push(suite);
      return;
    }

    // Check working directory cleanliness
    try {
      const { stdout } = await execAsync('git status --porcelain');
      const isClean = stdout.trim() === '';
      suite.results.push({
        details: isClean ? undefined : 'Commit or stash changes before release',
        message: isClean ? 'Working directory is clean' : 'Working directory has uncommitted changes',
        passed: isClean
      });
    } catch (error) {
      suite.results.push({
        details: String(error),
        message: 'Could not check git status',
        passed: false
      });
    }

    // Check current branch
    try {
      const { stdout } = await execAsync('git branch --show-current');
      const branch = stdout.trim();
      suite.results.push({
        message: `Current branch: ${branch}`,
        passed: true
      });
    } catch (error) {
      suite.results.push({
        details: String(error),
        message: 'Could not determine current branch',
        passed: false
      });
    }

    // Check remote connection
    try {
      await execAsync('git remote show origin');
      suite.results.push({
        message: 'Remote origin is accessible',
        passed: true
      });
    } catch {
      suite.results.push({
        details: 'Ensure you can push to the remote repository',
        message: 'Remote origin not accessible',
        passed: false
      });
    }

    this.suites.push(suite);
  }

  private async validateDependencies(): Promise<void> {
    const suite: ValidationSuite = { name: 'Dependencies', results: [] };

    // Check package.json exists
    const packageJsonPath = path.resolve('package.json');
    if (await fs.pathExists(packageJsonPath)) {
      suite.results.push({
        message: 'package.json found',
        passed: true
      });

      try {
        const packageJson = await fs.readJson(packageJsonPath);

        // Check required fields
        const requiredFields = ['name', 'version', 'scripts'];
        for (const field of requiredFields) {
          if (packageJson[field]) {
            suite.results.push({
              message: `package.json has ${field}`,
              passed: true
            });
          } else {
            suite.results.push({
              details: `Required field: ${field}`,
              message: `package.json missing ${field}`,
              passed: false
            });
          }
        }
      } catch (error) {
        suite.results.push({
          details: String(error),
          message: 'Could not parse package.json',
          passed: false
        });
      }
    } else {
      suite.results.push({
        details: 'package.json is required for version management',
        message: 'package.json not found',
        passed: false
      });
    }

    // Check node_modules
    const nodeModulesPath = path.resolve('node_modules');
    if (await fs.pathExists(nodeModulesPath)) {
      suite.results.push({
        message: 'node_modules found',
        passed: true
      });
    } else {
      suite.results.push({
        details: 'Run: pnpm install',
        message: 'node_modules not found',
        passed: false
      });
    }

    this.suites.push(suite);
  }

  private async validateScripts(): Promise<void> {
    const suite: ValidationSuite = { name: 'Scripts', results: [] };

    const requiredScripts = [
      { name: 'Build script', script: 'scripts/build/index.ts' },
      { name: 'Publish script', script: 'scripts/publish/index.ts' },
      { name: 'Coherency script', script: 'scripts/coherency/index.ts' },
      { name: 'Release script', script: 'scripts/version/release.ts' }
    ];

    for (const { script, name } of requiredScripts) {
      const scriptPath = path.resolve(script);
      if (await fs.pathExists(scriptPath)) {
        suite.results.push({
          message: `${name} found`,
          passed: true
        });
      } else {
        suite.results.push({
          details: `Missing: ${script}`,
          message: `${name} not found`,
          passed: false
        });
      }
    }

    this.suites.push(suite);
  }

  private async validateBuildSystem(): Promise<void> {
    const suite: ValidationSuite = { name: 'Build System', results: [] };

    // Check if we can run tests
    try {
      console.log('   🧪 Testing test command...');
      await execAsync('pnpm test', { timeout: 30_000 });
      suite.results.push({
        message: 'Tests run successfully',
        passed: true
      });
    } catch {
      suite.results.push({
        details: 'Fix test failures before release',
        message: 'Tests failed',
        passed: false
      });
    }

    // Check if we can build
    try {
      console.log('   🏗️ Testing build command...');
      await execAsync('pnpm run build', { timeout: 60_000 });
      suite.results.push({
        message: 'Build completed successfully',
        passed: true
      });

      // Check build output
      const buildPath = path.resolve('build');
      if (await fs.pathExists(buildPath)) {
        const buildDirs = await fs.readdir(buildPath);
        suite.results.push({
          details: buildDirs.length === 0 ? 'No packages were built' : undefined,
          message: `Build output: ${buildDirs.length} packages`,
          passed: buildDirs.length > 0
        });
      }
    } catch {
      suite.results.push({
        details: 'Fix build errors before release',
        message: 'Build failed',
        passed: false
      });
    }

    // Check coherency tests
    try {
      console.log('   🔍 Testing coherency...');
      await execAsync('pnpm run coherency', { timeout: 30_000 });
      suite.results.push({
        message: 'Coherency tests passed',
        passed: true
      });
    } catch {
      suite.results.push({
        details: 'Fix coherency issues before release',
        message: 'Coherency tests failed',
        passed: false
      });
    }

    this.suites.push(suite);
  }

  private printResults(): void {
    console.log('\n' + '='.repeat(60));
    console.log('📋 PRE-RELEASE VALIDATION RESULTS');
    console.log('='.repeat(60));

    for (const suite of this.suites) {
      console.log(`\n🔍 ${suite.name}:`);

      for (const result of suite.results) {
        const status = result.passed ? '✅' : '❌';
        console.log(`  ${status} ${result.message}`);

        if (result.details) {
          console.log(`     ${result.details}`);
        }
      }
    }

    console.log('\n' + '='.repeat(60));

    const allPassed = this.suites.every(suite =>
      suite.results.every(result => result.passed)
    );

    if (allPassed) {
      console.log('🎉 All validation checks passed! Ready for release.');
      console.log('\nNext steps:');
      console.log('  • pnpm run release:dry-run    (test the release process)');
      console.log('  • pnpm run release:patch      (patch release)');
      console.log('  • pnpm run release:minor      (minor release)');
    } else {
      console.log('❌ Some validation checks failed. Please fix issues before release.');
    }
  }
}

// CLI usage
if (import.meta.url.endsWith(process.argv[1])) {
  const validator = new PreReleaseValidator();
  validator.validate().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(console.error);
}
