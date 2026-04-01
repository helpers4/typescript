/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { ensureDir } from "fs-extra";
import { join } from "node:path";
import { DIR, BUILD } from "../constants";
import {
  copyStaticBundleFiles,
  createBundleMetadata,
  prepareBundlePackageJson,
  prepareBundleReadme
} from "./helpers";

/**
 * Build the bundle package that includes all categories.
 * @param validCategories - Array of category names to include in the bundle
 */
export async function buildBundle(validCategories: string[]): Promise<void> {
  if (validCategories.length === 0) {
    console.info(" ⚠️ No valid categories found, skipping bundle build");
    return;
  }

  const buildBundleDir = join(DIR.BUILD, BUILD.BUNDLE_NAME);

  // Create the bundle directory in /build
  await ensureDir(buildBundleDir);

  // Copy static files (LICENSE.md)
  await copyStaticBundleFiles(buildBundleDir);

  // Prepare bundle README.md
  await prepareBundleReadme(buildBundleDir, validCategories);

  // Prepare bundle package.json with dependencies
  await prepareBundlePackageJson(buildBundleDir, validCategories);

  // Create metadata files
  await createBundleMetadata(buildBundleDir, validCategories);

  console.info(` ✔️🎁 Built bundle package (@helpers4/all) with ${validCategories.length} categories`);
}
