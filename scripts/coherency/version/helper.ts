/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import fs from 'fs-extra';
import path from 'node:path';

/**
 * Test version consistency across all packages
 */
export async function testVersionConsistency(): Promise<void> {
  console.log("  📋 Checking version consistency...");

  const rootPackageJson = await fs.readJson(path.resolve(process.cwd(), 'package.json'));
  const rootVersion = rootPackageJson.version;

  console.log(`  📌 Root version: ${rootVersion}`);

  // Check build directory packages
  const buildDir = path.resolve(process.cwd(), 'build');
  if (!await fs.pathExists(buildDir)) {
    throw new Error("Build directory does not exist. Run build first.");
  }

  const buildDirs = await fs.readdir(buildDir);

  for (const dir of buildDirs) {
    const packageJsonPath = path.join(buildDir, dir, 'package.json');

    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      const packageVersion = packageJson.version;

      if (packageVersion !== rootVersion) {
        throw new Error(`Version mismatch: ${packageJson.name} has version ${packageVersion}, expected ${rootVersion}`);
      }

      console.log(`  ✅ ${packageJson.name}: ${packageVersion}`);
    }
  }

  console.log("  ✅ Version consistency test passed");
}
