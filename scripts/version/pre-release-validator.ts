#!/usr/bin/env node

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

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
        passed: true,
        message: `Node.js version: ${version}`
      });
    } catch (error) {
      suite.results.push({
        passed: false,
        message: 'Node.js not found',
        details: 'Node.js is required for the build process'
      });
    }

    // Check npm
    try {
      const { stdout } = await execAsync('npm --version');
      const version = stdout.trim();
      suite.results.push({
        passed: true,
        message: `npm version: ${version}`
      });
    } catch (error) {
      suite.results.push({
        passed: false,
        message: 'npm not found',
        details: 'npm is required as the package manager'
      });
    }

    // Check Git
    try {
      const { stdout } = await execAsync('git --version');
      const version = stdout.trim();
      suite.results.push({
        passed: true,
        message: `Git version: ${version}`
      });
    } catch (error) {
      suite.results.push({
        passed: false,
        message: 'Git not found',
        details: 'Git is required for version control operations'
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
        passed: true,
        message: 'Git repository detected'
      });
    } catch (error) {
      suite.results.push({
        passed: false,
        message: 'Not in a git repository',
        details: 'Release process requires a git repository'
      });
      this.suites.push(suite);
      return;
    }

    // Check working directory cleanliness
    try {
      const { stdout } = await execAsync('git status --porcelain');
      const isClean = stdout.trim() === '';
      suite.results.push({
        passed: isClean,
        message: isClean ? 'Working directory is clean' : 'Working directory has uncommitted changes',
        details: isClean ? undefined : 'Commit or stash changes before release'
      });
    } catch (error) {
      suite.results.push({
        passed: false,
        message: 'Could not check git status',
        details: String(error)
      });
    }

    // Check current branch
    try {
      const { stdout } = await execAsync('git branch --show-current');
      const branch = stdout.trim();
      suite.results.push({
        passed: true,
        message: `Current branch: ${branch}`
      });
    } catch (error) {
      suite.results.push({
        passed: false,
        message: 'Could not determine current branch',
        details: String(error)
      });
    }

    // Check remote connection
    try {
      await execAsync('git remote show origin');
      suite.results.push({
        passed: true,
        message: 'Remote origin is accessible'
      });
    } catch (error) {
      suite.results.push({
        passed: false,
        message: 'Remote origin not accessible',
        details: 'Ensure you can push to the remote repository'
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
        passed: true,
        message: 'package.json found'
      });

      try {
        const packageJson = await fs.readJson(packageJsonPath);

        // Check required fields
        const requiredFields = ['name', 'version', 'scripts'];
        for (const field of requiredFields) {
          if (packageJson[field]) {
            suite.results.push({
              passed: true,
              message: `package.json has ${field}`
            });
          } else {
            suite.results.push({
              passed: false,
              message: `package.json missing ${field}`,
              details: `Required field: ${field}`
            });
          }
        }
      } catch (error) {
        suite.results.push({
          passed: false,
          message: 'Could not parse package.json',
          details: String(error)
        });
      }
    } else {
      suite.results.push({
        passed: false,
        message: 'package.json not found',
        details: 'package.json is required for version management'
      });
    }

    // Check node_modules
    const nodeModulesPath = path.resolve('node_modules');
    if (await fs.pathExists(nodeModulesPath)) {
      suite.results.push({
        passed: true,
        message: 'node_modules found'
      });
    } else {
      suite.results.push({
        passed: false,
        message: 'node_modules not found',
        details: 'Run: npm install'
      });
    }

    this.suites.push(suite);
  }

  private async validateScripts(): Promise<void> {
    const suite: ValidationSuite = { name: 'Scripts', results: [] };

    const requiredScripts = [
      { script: 'scripts/build/index.ts', name: 'Build script' },
      { script: 'scripts/publish/index.ts', name: 'Publish script' },
      { script: 'scripts/coherency/index.ts', name: 'Coherency script' },
      { script: 'scripts/version/release.ts', name: 'Release script' }
    ];

    for (const { script, name } of requiredScripts) {
      const scriptPath = path.resolve(script);
      if (await fs.pathExists(scriptPath)) {
        suite.results.push({
          passed: true,
          message: `${name} found`
        });
      } else {
        suite.results.push({
          passed: false,
          message: `${name} not found`,
          details: `Missing: ${script}`
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
      await execAsync('npm test', { timeout: 30000 });
      suite.results.push({
        passed: true,
        message: 'Tests run successfully'
      });
    } catch (error) {
      suite.results.push({
        passed: false,
        message: 'Tests failed',
        details: 'Fix test failures before release'
      });
    }

    // Check if we can build
    try {
      console.log('   🏗️ Testing build command...');
      await execAsync('npm run build', { timeout: 60000 });
      suite.results.push({
        passed: true,
        message: 'Build completed successfully'
      });

      // Check build output
      const buildPath = path.resolve('build');
      if (await fs.pathExists(buildPath)) {
        const buildDirs = await fs.readdir(buildPath);
        suite.results.push({
          passed: buildDirs.length > 0,
          message: `Build output: ${buildDirs.length} packages`,
          details: buildDirs.length === 0 ? 'No packages were built' : undefined
        });
      }
    } catch (error) {
      suite.results.push({
        passed: false,
        message: 'Build failed',
        details: 'Fix build errors before release'
      });
    }

    // Check coherency tests
    try {
      console.log('   🔍 Testing coherency...');
      await execAsync('npm run coherency', { timeout: 30000 });
      suite.results.push({
        passed: true,
        message: 'Coherency tests passed'
      });
    } catch (error) {
      suite.results.push({
        passed: false,
        message: 'Coherency tests failed',
        details: 'Fix coherency issues before release'
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
      console.log('  • npm run release:dry-run    (test the release process)');
      console.log('  • npm run release:patch      (patch release)');
      console.log('  • npm run release:minor      (minor release)');
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
