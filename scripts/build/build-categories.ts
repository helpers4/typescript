/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { ensureDir } from "fs-extra";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { DIR } from "../constants";
import {
  compileTypeScript,
  copyStaticCategoryFiles,
  createIndexFile,
  getExternalDependencies,
  prepareCategoryPackageJson,
  prepareCategoryReadme
} from "./helpers";

/**
 * Build all individual category packages.
 * @returns Array of valid categories that were built
 */
export async function buildCategories(): Promise<string[]> {
  // Read categories in the /helpers directory
  const categories = (await readdir(DIR.HELPERS)).sort();
  const validCategories: string[] = [];

  // Build individual categories
  for (const category of categories) {
    const categoryPath = join(DIR.HELPERS, category);
    const files = await readdir(categoryPath);

    // Filter .ts files, ignoring .test.ts, .bench.ts, index.ts, etc.
    const tsFiles = files
      .filter(file => file.endsWith(".ts"))
      .filter(file => !file.match(/\.\w+\.ts$/))
      .filter(file => file !== "index.ts");

    if (tsFiles.length > 0) {
      const buildCategoryDir = join(DIR.BUILD, category);
      const libDir = join(buildCategoryDir, "lib");

      // Create the category directory in /build
      await ensureDir(libDir);

      // Create an index.ts to export all methods
      const indexFilePath = await createIndexFile(categoryPath, tsFiles);

      // Compile everything into a single bundled index.js and generate proper .d.ts
      await compileTypeScript(indexFilePath, libDir);

      // Copy static files
      await copyStaticCategoryFiles(buildCategoryDir);

      // Copy and prepare README.md
      await prepareCategoryReadme(buildCategoryDir, category, tsFiles, categories);

      // Get external dependencies for this category
      const externalDependencies = await getExternalDependencies(category);

      // Copy and prepare package.json
      await prepareCategoryPackageJson(buildCategoryDir, category, tsFiles, externalDependencies);

      validCategories.push(category);
      console.info(` ✔️📦 Built ${category}`);
    }
  }

  return validCategories;
}
