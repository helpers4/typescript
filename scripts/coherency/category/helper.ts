/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import fs from 'fs-extra';
import path from 'path';

/**
 * Test category packages integrity
 */
export async function testCategoryPackages(): Promise<void> {
  console.log("  📋 Checking category packages integrity...");

  const buildDir = path.resolve(process.cwd(), 'build');
  if (!await fs.pathExists(buildDir)) {
    throw new Error("Build directory does not exist. Run build first.");
  }

  const buildDirs = await fs.readdir(buildDir);
  const categoryDirs = buildDirs.filter(dir => dir !== 'all');

  for (const categoryDir of categoryDirs) {
    const categoryPath = path.join(buildDir, categoryDir);
    const stat = await fs.stat(categoryPath);

    if (!stat.isDirectory()) {
      continue;
    }

    console.log(`  📦 Checking category: ${categoryDir}`);

    // Check required files exist
    const requiredFiles = [
      'package.json',
      'README.md',
      'LICENSE.md',
      'llms.txt',
      'meta/api.json',
      'meta/examples.json',
      'meta/licenses.json',
    ];
    for (const file of requiredFiles) {
      const filePath = path.join(categoryPath, file);
      if (!await fs.pathExists(filePath)) {
        throw new Error(`Missing required file: ${file} in category ${categoryDir}`);
      }
    }

    // Check package.json structure
    const packageJsonPath = path.join(categoryPath, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);

    // Validate required package.json fields
    const requiredFields = ['name', 'version', 'description', 'main', 'types', 'exports'];
    for (const field of requiredFields) {
      if (!packageJson[field]) {
        throw new Error(`Missing required field '${field}' in ${categoryDir}/package.json`);
      }
    }

    // Check if lib directory exists and has content
    const libDir = path.join(categoryPath, 'lib');
    if (await fs.pathExists(libDir)) {
      const libFiles = await fs.readdir(libDir);
      if (libFiles.length === 0) {
        throw new Error(`Empty lib directory in category ${categoryDir}`);
      }

      // Check for index files
      const hasIndexJs = libFiles.some(file => file === 'index.js');
      const hasIndexDts = libFiles.some(file => file === 'index.d.ts');

      if (!hasIndexJs || !hasIndexDts) {
        throw new Error(`Missing index files (index.js or index.d.ts) in ${categoryDir}/lib`);
      }
    } else {
      throw new Error(`Missing lib directory in category ${categoryDir}`);
    }

    console.log(`  ✅ ${categoryDir}: All checks passed`);
  }

  console.log(`  ✅ Category packages integrity test passed (${categoryDirs.length} categories)`);
}
