#!/usr/bin/env node

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Bundle size analysis coherency test
 * Analyzes and reports the size of each package (categories + bundle)
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface PackageSize {
  name: string;
  path: string;
  size: string;
  sizeBytes: number;
}

function formatSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)}${units[unitIndex]}`;
}

function getDirectorySize(dirPath: string): { size: string; bytes: number } {
  try {
    const output = execSync(`du -sb "${dirPath}" 2>/dev/null || echo "0\t${dirPath}"`, {
      encoding: 'utf-8'
    }).trim();

    const [sizeStr] = output.split('\t');
    const bytes = parseInt(sizeStr, 10);

    return {
      size: formatSize(bytes),
      bytes
    };
  } catch (error) {
    console.log(`⚠️  Error calculating size for ${dirPath}: ${error}`);
    return { size: 'N/A', bytes: 0 };
  }
}

export async function testBundleSizes(): Promise<void> {
  const buildDir = path.join(process.cwd(), 'build');

  if (!fs.existsSync(buildDir)) {
    throw new Error('Build directory does not exist. Run build first.');
  }

  console.log('  📋 Analyzing package sizes...');

  const packages: PackageSize[] = [];
  let totalSize = 0;

  // Get all directories in build/
  const buildContents = fs.readdirSync(buildDir, { withFileTypes: true });
  const directories = buildContents.filter(item => item.isDirectory());

  for (const dir of directories) {
    const packagePath = path.join(buildDir, dir.name);
    const { size, bytes } = getDirectorySize(packagePath);

    packages.push({
      name: `@helpers4/${dir.name}`,
      path: packagePath,
      size,
      sizeBytes: bytes
    });

    totalSize += bytes;

    console.log(`  📦 ${dir.name}: ${size}`);
  }

  // Sort packages by size (largest first)
  packages.sort((a, b) => b.sizeBytes - a.sizeBytes);

  console.log(`  📊 Total build size: ${formatSize(totalSize)}`);
  console.log(`  🎯 Packages analyzed: ${packages.length}`);

  // Check for unusually large packages (> 100KB)
  const largePackages = packages.filter(pkg => pkg.sizeBytes > 100 * 1024);
  if (largePackages.length > 0) {
    console.log(`  ⚠️  Large packages (>100KB):`);
    largePackages.forEach(pkg => {
      console.log(`     - ${pkg.name}: ${pkg.size}`);
    });
  }

  // Check for empty packages (< 1KB)
  const smallPackages = packages.filter(pkg => pkg.sizeBytes < 1024);
  if (smallPackages.length > 0) {
    console.log(`  ⚠️  Small packages (<1KB):`);
    smallPackages.forEach(pkg => {
      console.log(`     - ${pkg.name}: ${pkg.size}`);
    });
  }

  console.log('  ✅ Bundle size analysis completed');
}