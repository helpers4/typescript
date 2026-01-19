#!/usr/bin/env node

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/**
 * Bundle Package coherency test
 */

import { join } from "node:path";
import { existsSync, readFileSync } from "node:fs";

function readFileText(filePath: string): string {
  return readFileSync(filePath, 'utf-8');
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

  console.log(`✅ Bundle contains ${buildMeta.totalCategories} categories`);
  console.log(`✅ Build date: ${new Date(buildMeta.buildDate as string).toLocaleString()}`);
  console.log(`✅ Version: ${buildMeta.version}`);
  console.log(`✅ Dependencies: ${Object.keys((packageJson.dependencies as Record<string, string>) || {}).length} packages`);
  console.log(`✅ Metadata includes ${Object.keys(packagesMeta).length} package versions`);

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