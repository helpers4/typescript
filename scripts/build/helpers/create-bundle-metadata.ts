/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { createCollectionMetadata } from "./create-collection-metadata";

/**
 * Create metadata files for the bundle.
 * @param buildBundleDir - The build bundle directory.
 * @param categories - The list of available categories.
 */
export async function createBundleMetadata(
  buildBundleDir: string,
  categories: string[]
) {
  return createCollectionMetadata(buildBundleDir, categories, "@helpers4/all");
}
