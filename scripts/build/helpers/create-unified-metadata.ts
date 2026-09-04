/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { createCollectionMetadata } from "./create-collection-metadata";

/**
 * Create metadata files for the unified package.
 * @param buildUnifiedDir - The build unified package directory.
 * @param categories - The list of available categories.
 */
export async function createUnifiedMetadata(
  buildUnifiedDir: string,
  categories: string[]
) {
  return createCollectionMetadata(buildUnifiedDir, categories, "helpers4");
}
