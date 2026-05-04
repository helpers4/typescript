#!/usr/bin/env node

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Bundle Package coherency test
 */

import { join } from "node:path";
import { existsSync, readFileSync, readdirSync } from "node:fs";

function readFileText(filePath: string): string {
  return readFileSync(filePath, 'utf8');
}

function readFileJson<T>(filePath: string): T {
  return JSON.parse(readFileText(filePath)) as T;
}

async function testBundle() {
  console.log("🧪 Testing @helpers4/all bundle package...");

  const bundlePath = join(process.cwd(), "build/all");

  // Check if all expected files exist
  const expectedFiles = [
    "package.json",
    "README.md",
    "LICENSE.md",
    "llms.txt",
    "meta/build.json",
    "meta/packages.json"
  ];

  for (const file of expectedFiles) {
    const filePath = join(bundlePath, file);
    if (existsSync(filePath)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ ${file} missing`);
      return false;
    }
  }

  // Test metadata content
  const buildMeta = readFileJson<Record<string, unknown>>(join(bundlePath, "meta/build.json"));
  const packagesMeta = readFileJson<Record<string, unknown>>(join(bundlePath, "meta/packages.json"));
  const packageJson = readFileJson<Record<string, unknown>>(join(bundlePath, "package.json"));
  const rootPackageJson = readFileJson<Record<string, unknown>>(join(process.cwd(), "package.json"));

  // Assert version matches root package.json
  const rootVersion = rootPackageJson.version as string;
  if (buildMeta.version !== rootVersion) {
    throw new Error(`Version mismatch in build.json: ${buildMeta.version} !== root ${rootVersion}`);
  }
  console.log(`✅ Version: ${buildMeta.version}`);

  // Assert build date is present and parseable
  const buildDate = new Date(buildMeta.buildDate as string);
  if (Number.isNaN(buildDate.getTime())) {
    throw new Error(`Invalid buildDate in build.json: ${buildMeta.buildDate}`);
  }
  console.log(`✅ Build date: ${buildDate.toLocaleString()}`);

  // Assert totalCategories matches actual category dirs in build/ (excluding 'all')
  const buildDir = join(process.cwd(), "build");
  const actualCategories = readdirSync(buildDir, { withFileTypes: true })
    .filter(e => e.isDirectory() && e.name !== 'all')
    .map(e => e.name)
    .toSorted();
  const actualCount = actualCategories.length;
  if (buildMeta.totalCategories !== actualCount) {
    throw new Error(`totalCategories mismatch: build.json says ${buildMeta.totalCategories}, actual dirs: ${actualCount}`);
  }
  console.log(`✅ Bundle contains ${buildMeta.totalCategories} categories`);

  // Assert categories list matches actual dirs
  const metaCategories = (buildMeta.categories as string[]).slice().toSorted();
  const missing = actualCategories.filter(c => !metaCategories.includes(c));
  const extra = metaCategories.filter(c => !actualCategories.includes(c));
  if (missing.length > 0 || extra.length > 0) {
    throw new Error(`Categories mismatch in build.json. Missing: [${missing.join(', ')}], Extra: [${extra.join(', ')}]`);
  }

  // Assert packages metadata count matches category count + 1 (all)
  const packagesCount = Object.keys(packagesMeta).length;
  if (packagesCount !== actualCount + 1) {
    throw new Error(`packages.json has ${packagesCount} entries, expected ${actualCount + 1} (${actualCount} categories + all)`);
  }
  console.log(`✅ Metadata includes ${packagesCount} package versions`);

  console.log(`✅ Dependencies: ${Object.keys((packageJson.dependencies as Record<string, string>) || {}).length} packages`);

  console.log("\n🎉 Bundle package test completed successfully!");
  return true;
}

async function runBundleTest() {
  try {
    console.log("🧪 Bundle Package:");
    console.log("   Tests the main bundle package integrity");

    const result = await testBundle();

    if (result === false) {
      throw new Error("Test Bundle Package returned false");
    }

    console.log("✅ Bundle Package passed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Bundle Package failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the test if this script is called directly
runBundleTest().catch(console.error);
