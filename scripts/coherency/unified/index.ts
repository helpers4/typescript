#!/usr/bin/env node

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Unified package (helpers4) coherency test
 */

import { join } from "node:path";
import { existsSync, readFileSync, readdirSync } from "node:fs";

function readFileText(filePath: string): string {
  return readFileSync(filePath, 'utf8');
}

function readFileJson<T>(filePath: string): T {
  return JSON.parse(readFileText(filePath)) as T;
}

async function testUnified() {
  console.log("🧪 Testing helpers4 unified package...");

  const unifiedPath = join(process.cwd(), "build/helpers4");

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
    const filePath = join(unifiedPath, file);
    if (existsSync(filePath)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ ${file} missing`);
      return false;
    }
  }

  const packageJson = readFileJson<Record<string, unknown>>(join(unifiedPath, "package.json"));
  const rootPackageJson = readFileJson<Record<string, unknown>>(join(process.cwd(), "package.json"));

  // Assert version matches root package.json
  const rootVersion = rootPackageJson.version as string;
  if (packageJson.version !== rootVersion) {
    throw new Error(`Version mismatch in helpers4/package.json: ${packageJson.version} !== root ${rootVersion}`);
  }
  console.log(`✅ Version: ${packageJson.version}`);

  // The whole point of this package is that the root is NOT importable — only
  // helpers4/<category> subpaths resolve. A "." export here would silently defeat that.
  const exportsField = packageJson.exports as Record<string, unknown> | undefined;
  if (exportsField?.["."]) {
    throw new Error('helpers4/package.json must not export "." — only per-category subpaths');
  }
  console.log(`✅ No root "." export`);

  // Assert every built category has a real dependency, an exports subpath, and a shim on disk
  // that actually re-exports the matching @helpers4/<category> package.
  const buildDir = join(process.cwd(), "build");
  const actualCategories = readdirSync(buildDir, { withFileTypes: true })
    .filter(e => e.isDirectory() && e.name !== 'all' && e.name !== 'helpers4')
    .map(e => e.name)
    .toSorted();

  const dependencies = (packageJson.dependencies as Record<string, string>) ?? {};

  for (const category of actualCategories) {
    const depName = `@helpers4/${category}`;

    if (dependencies[depName] !== rootVersion) {
      throw new Error(`helpers4/package.json is missing (or version-mismatched) dependency on ${depName}`);
    }

    if (!exportsField?.[`./${category}`]) {
      throw new Error(`helpers4/package.json is missing an exports entry for ./${category}`);
    }

    const shimJsPath = join(unifiedPath, category, "index.js");
    const shimDtsPath = join(unifiedPath, category, "index.d.ts");
    if (!existsSync(shimJsPath) || !existsSync(shimDtsPath)) {
      throw new Error(`Missing helpers4/${category}/index.js or index.d.ts shim`);
    }

    if (!readFileText(shimJsPath).includes(depName) || !readFileText(shimDtsPath).includes(depName)) {
      throw new Error(`helpers4/${category} shim does not re-export ${depName}`);
    }
  }
  console.log(`✅ ${actualCategories.length} category shims present, exported, and dependency-pinned to ${rootVersion}`);

  console.log("\n🎉 Unified package test completed successfully!");
  return true;
}

async function runUnifiedTest() {
  try {
    console.log("🧪 Unified Package:");
    console.log("   Tests the helpers4 unified package integrity");

    const result = await testUnified();

    if (result === false) {
      throw new Error("Test Unified Package returned false");
    }

    console.log("✅ Unified Package passed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Unified Package failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the test if this script is called directly
runUnifiedTest().catch(console.error);
