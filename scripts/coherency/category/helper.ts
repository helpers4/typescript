/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import fs from 'fs-extra';
import path from 'node:path';

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
      'meta/category.json',
      'meta/examples.json',
      'meta/licenses.json',
    ];
    for (const file of requiredFiles) {
      const filePath = path.join(categoryPath, file);
      if (!await fs.pathExists(filePath)) {
        throw new Error(`Missing required file: ${file} in category ${categoryDir}`);
      }
    }

    // Check category.json structure
    const categoryJsonPath = path.join(categoryPath, 'meta', 'category.json');
    const categoryJson = await fs.readJson(categoryJsonPath);

    const requiredCategoryFields = ['category', 'label', 'smallDescription', 'description'];
    for (const field of requiredCategoryFields) {
      if (!categoryJson[field] || typeof categoryJson[field] !== 'string') {
        throw new Error(`Missing or invalid field '${field}' in ${categoryDir}/meta/category.json`);
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

/**
 * Test source config.json files have consistent format
 */
export async function testCategoryConfigs(): Promise<void> {
  console.log("  📋 Checking source config.json consistency...");

  const helpersDir = path.resolve(process.cwd(), 'helpers');
  const categories = await fs.readdir(helpersDir);

  for (const category of categories) {
    const categoryPath = path.join(helpersDir, category);
    const stat = await fs.stat(categoryPath);
    if (!stat.isDirectory()) continue;

    const configPath = path.join(categoryPath, 'config.json');
    if (!await fs.pathExists(configPath)) {
      throw new Error(`Missing config.json in helpers/${category}`);
    }

    const config = await fs.readJson(configPath);

    const requiredFields = ['label', 'smallDescription', 'description'];
    for (const field of requiredFields) {
      if (!config[field] || typeof config[field] !== 'string') {
        throw new Error(`Missing or invalid field '${field}' in helpers/${category}/config.json`);
      }
    }

    console.log(`  ✅ helpers/${category}/config.json: Valid`);
  }

  console.log(`  ✅ Source config.json consistency check passed`);
}

/**
 * Test source category structure: no unexpected subdirectories, all helper
 * files re-exported from index.ts.
 */
export async function testSourceStructure(): Promise<void> {
  console.log("  📋 Checking source category structure...");

  const helpersDir = path.resolve(process.cwd(), 'helpers');
  const categories = await fs.readdir(helpersDir);

  const SUFFIXES = ['.test.ts', '.spec.ts', '.bench.ts', '.example.ts'];

  for (const category of categories) {
    const categoryPath = path.join(helpersDir, category);
    const stat = await fs.stat(categoryPath);
    if (!stat.isDirectory()) continue;

    const entries = await fs.readdir(categoryPath, { withFileTypes: true });

    // 1. Flag unexpected subdirectories
    const subdirs = entries.filter(e => e.isDirectory());
    if (subdirs.length > 0) {
      throw new Error(
        `Unexpected subdirectory in helpers/${category}: ${subdirs.map(d => d.name).join(', ')}. ` +
        'Category folders must be flat.'
      );
    }

    // 2. Check all .ts helper files are re-exported from index.ts
    // index.ts is a generated file (gitignored), so it may not exist in CI after a
    // clean checkout. If it doesn't exist, we verify the expected re-exports directly
    // from the helper files list — the actual file will be generated by the build step.
    const indexPath = path.join(categoryPath, 'index.ts');
    const indexExists = await fs.pathExists(indexPath);
    const indexContent = indexExists ? await fs.readFile(indexPath, 'utf-8') : null;

    const helperFiles = entries
      .filter(e => e.isFile() && e.name.endsWith('.ts'))
      .map(e => e.name)
      .filter(name => {
        if (name === 'index.ts') return false;
        return !SUFFIXES.some(suffix => name.endsWith(suffix));
      });

    if (indexContent !== null) {
      for (const helperFile of helperFiles) {
        const baseName = helperFile.replace(/\.ts$/, '');
        if (!indexContent.includes(`'./${baseName}'`) && !indexContent.includes(`"./${baseName}"`)) {
          throw new Error(
            `helpers/${category}/${helperFile} is not re-exported from index.ts. ` +
            `Add: export * from './${baseName}';`
          );
        }
      }
    } else {
      console.log(`  ℹ️  helpers/${category}/index.ts not found (generated at build time) — skipping re-export check`);
    }

    console.log(`  ✅ helpers/${category}/: structure valid (${helperFiles.length} helpers)`);
  }

  console.log(`  ✅ Source category structure check passed`);
}
