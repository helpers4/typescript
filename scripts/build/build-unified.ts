/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { ensureDir } from "fs-extra";
import { join } from "node:path";
import { DIR, BUILD } from "../constants";
import {
  copyStaticUnifiedFiles,
  createUnifiedCategoryShims,
  createUnifiedMetadata,
  prepareUnifiedPackageJson,
  prepareUnifiedReadme
} from "./helpers";

/**
 * Build the unified `helpers4` package: every category reachable as `helpers4/<category>`,
 * as a real (not peer) dependency, from a single top-level npm install.
 * @param validCategories - Array of category names to include in the unified package
 */
export async function buildUnified(validCategories: string[]): Promise<void> {
  if (validCategories.length === 0) {
    console.info(" ⚠️ No valid categories found, skipping unified package build");
    return;
  }

  const buildUnifiedDir = join(DIR.BUILD, BUILD.UNIFIED_NAME);

  // Create the unified package directory in /build
  await ensureDir(buildUnifiedDir);

  // Copy static files (LICENSE.md)
  await copyStaticUnifiedFiles(buildUnifiedDir);

  // Prepare unified README.md
  await prepareUnifiedReadme(buildUnifiedDir, validCategories);

  // Write the helpers4/<category> re-export shims
  await createUnifiedCategoryShims(buildUnifiedDir, validCategories);

  // Prepare unified package.json with real dependencies and per-category exports
  await prepareUnifiedPackageJson(buildUnifiedDir, validCategories);

  // Create metadata files
  await createUnifiedMetadata(buildUnifiedDir, validCategories);

  console.info(` ✔️🧩 Built unified package (helpers4) with ${validCategories.length} categories`);
}
