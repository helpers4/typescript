/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import fs from 'fs-extra';
import path from 'path';

/**
 * Test dependencies coherency across packages
 */
export async function testDependenciesCoherency(): Promise<void> {
  console.log("  📋 Checking dependencies coherency...");

  const rootPackageJson = await fs.readJson(path.resolve(process.cwd(), 'package.json'));
  const rootDependencies = {
    ...rootPackageJson.dependencies,
    ...rootPackageJson.devDependencies,
    ...rootPackageJson.peerDependencies
  };

  const buildDir = path.resolve(process.cwd(), 'build');
  if (!await fs.pathExists(buildDir)) {
    throw new Error("Build directory does not exist. Run build first.");
  }

  const buildDirs = await fs.readdir(buildDir);

  for (const dir of buildDirs) {
    const packageJsonPath = path.join(buildDir, dir, 'package.json');

    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);

      console.log(`  🔍 Checking dependencies for: ${packageJson.name}`);

      // Check dependencies consistency
      const packageDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
        ...packageJson.peerDependencies
      };

      for (const [depName, depVersion] of Object.entries(packageDeps)) {
        if (rootDependencies[depName] && rootDependencies[depName] !== depVersion) {
          console.warn(`  ⚠️  Version mismatch for ${depName}: ${packageJson.name} uses ${depVersion}, root uses ${rootDependencies[depName]}`);
        }
      }

      // Check for required licenses
      if (!packageJson.license) {
        throw new Error(`Missing license field in ${packageJson.name}`);
      }

      // Check repository field
      if (!packageJson.repository) {
        throw new Error(`Missing repository field in ${packageJson.name}`);
      }

      console.log(`  ✅ ${packageJson.name}: Dependencies coherency OK`);
    }
  }

  console.log("  ✅ Dependencies coherency test passed");
}
