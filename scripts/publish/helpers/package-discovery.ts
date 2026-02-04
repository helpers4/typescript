/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import fs from 'fs-extra';
import path from 'path';
import { getPackageInfo } from './npm-utils';

export interface PackageMetadata {
  name: string;
  version: string;
  path: string;
  isCategory: boolean;
  isBundle: boolean;
  dependencies: string[];
}

/**
 * Discover all packages in the build directory
 */
export async function discoverPackages(buildDir: string): Promise<PackageMetadata[]> {
  if (!await fs.pathExists(buildDir)) {
    throw new Error(`Build directory not found: ${buildDir}`);
  }

  const packages: PackageMetadata[] = [];
  const entries = await fs.readdir(buildDir);

  for (const entry of entries) {
    const entryPath = path.join(buildDir, entry);
    const stat = await fs.stat(entryPath);

    if (!stat.isDirectory()) {
      continue;
    }

    const packageJsonPath = path.join(entryPath, 'package.json');
    if (!await fs.pathExists(packageJsonPath)) {
      continue;
    }

    try {
      const packageInfo = await getPackageInfo(entryPath);
      const packageJson = await fs.readJson(packageJsonPath);

      packages.push({
        name: packageInfo.name,
        version: packageInfo.version,
        path: entryPath,
        isCategory: entry !== 'all',
        isBundle: entry === 'all',
        dependencies: Object.keys({
          ...packageJson.dependencies,
          ...packageJson.peerDependencies
        })
      });
    } catch (error) {
      console.warn(`⚠️  Skipping invalid package at ${entryPath}:`, error);
    }
  }

  return packages;
}

/**
 * Sort packages for optimal publishing order
 * Categories first, bundle last
 */
export function sortPackagesForPublishing(packages: PackageMetadata[]): PackageMetadata[] {
  return packages.sort((a, b) => {
    // Bundle packages go last
    if (a.isBundle && !b.isBundle) return 1;
    if (!a.isBundle && b.isBundle) return -1;

    // Otherwise, sort alphabetically
    return a.name.localeCompare(b.name);
  });
}

/**
 * Group packages by type
 */
export function groupPackagesByType(packages: PackageMetadata[]): {
  categories: PackageMetadata[];
  bundles: PackageMetadata[];
} {
  const categories: PackageMetadata[] = [];
  const bundles: PackageMetadata[] = [];

  for (const pkg of packages) {
    if (pkg.isBundle) {
      bundles.push(pkg);
    } else {
      categories.push(pkg);
    }
  }

  return { categories, bundles };
}

/**
 * Validate package structure before publishing
 */
export async function validatePackageStructure(packagePath: string, isBundle: boolean = false): Promise<string[]> {
  const issues: string[] = [];

  // Check required files
  const requiredFiles = ['package.json', 'README.md', 'LICENSE.md'];
  for (const file of requiredFiles) {
    const filePath = path.join(packagePath, file);
    if (!await fs.pathExists(filePath)) {
      issues.push(`Missing required file: ${file}`);
    }
  }

  // Check package.json structure
  try {
    const packageJson = await fs.readJson(path.join(packagePath, 'package.json'));

    // Basic fields required for all packages
    const basicRequiredFields = ['name', 'version', 'description', 'license'];
    for (const field of basicRequiredFields) {
      if (!packageJson[field]) {
        issues.push(`Missing required field in package.json: ${field}`);
      }
    }

    // For category packages, check for code-related fields
    if (!isBundle) {
      const codeRequiredFields = ['main', 'types'];
      for (const field of codeRequiredFields) {
        if (!packageJson[field]) {
          issues.push(`Missing required field in package.json: ${field}`);
        }
      }

      // Check exports field for modern packages
      if (!packageJson.exports) {
        issues.push('Missing exports field in package.json');
      }

      // Check lib directory exists and has content
      const libPath = path.join(packagePath, 'lib');
      if (await fs.pathExists(libPath)) {
        const libFiles = await fs.readdir(libPath);
        if (libFiles.length === 0) {
          issues.push('Empty lib directory');
        }

        // Check for index files
        const hasIndexJs = libFiles.some(file => file === 'index.js');
        const hasIndexDts = libFiles.some(file => file === 'index.d.ts');

        if (!hasIndexJs) {
          issues.push('Missing index.js in lib directory');
        }
        if (!hasIndexDts) {
          issues.push('Missing index.d.ts in lib directory');
        }
      } else {
        issues.push('Missing lib directory');
      }
    } else {
      // For bundle packages, check for meta directory instead
      const metaPath = path.join(packagePath, 'meta');
      if (!await fs.pathExists(metaPath)) {
        issues.push('Missing meta directory');
      } else {
        const metaFiles = await fs.readdir(metaPath);
        if (metaFiles.length === 0) {
          issues.push('Empty meta directory');
        }
      }
    }
  } catch (error) {
    issues.push(`Invalid package.json: ${error}`);
  }

  return issues;
}
