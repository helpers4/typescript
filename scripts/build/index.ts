/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { emptyDir } from "fs-extra";
import { DIR } from "../constants";
import { buildCategories } from "./build-categories";
import { buildBundle } from "./build-bundle";
import { buildWebsiteMetadata } from "./build-website-metadata";

async function main() {
  // Create or empty the /build directory
  await emptyDir(DIR.BUILD);
  console.info(" ✔️🪥 Clean workspace");

  // Build all individual categories
  const validCategories = await buildCategories();

  // Generate enriched website metadata in meta/
  await buildWebsiteMetadata(validCategories);
  console.info(" ✔️🌐 Built website metadata");

  // Build the bundle package with all valid categories
  await buildBundle(validCategories);
}

main().catch(error => {
  console.error("❌ Build failed:", error);
  process.exit(1);
});
