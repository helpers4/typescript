#!/usr/bin/env node

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

// Simple index that runs all coherency tests by calling their individual scripts
import { execSync } from 'child_process';

const tests = ['bundle', 'version', 'category', 'dependencies', 'sizes'];

async function runAllTests() {
  console.log("🔍 Running coherency tests in parallel...\n");

  const commands = tests.map(test => `pnpm exec tsx scripts/coherency/${test}/index.ts`);
  const parallelCommand = commands.join(' & ') + '; wait';

  try {
    execSync(parallelCommand, { stdio: 'inherit', cwd: process.cwd() });
    console.log("\n🎉 All coherency tests completed!");
  } catch (error) {
    console.error("\n💥 Some coherency tests failed!");
    process.exit(1);
  }
}

// Run all tests
runAllTests().catch(console.error);
