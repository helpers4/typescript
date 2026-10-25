/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { BUILD } from "../../constants";

/**
 * Names a `helpers/<category>` directory must not take: each one is already a package built
 * into `build/<name>/` and published as `@helpers4/<name>` (or `helpers4` itself), so a
 * category with that name would overwrite it in the build and on npm.
 */
export const RESERVED_CATEGORY_NAMES: readonly string[] = [BUILD.BUNDLE_NAME, BUILD.UNIFIED_NAME, BUILD.PRESETS_NAME];

/**
 * Throw if a category takes a name reserved for a non-category package.
 * @param categories - The category directory names found under `helpers/`
 */
export function assertNoReservedCategoryName(categories: readonly string[]): void {
  const clashes = categories.filter(category => RESERVED_CATEGORY_NAMES.includes(category));
  if (clashes.length > 0) {
    throw new Error(
      `helpers/${clashes.join(", helpers/")}: reserved name (${RESERVED_CATEGORY_NAMES.join(", ")} are packages built outside helpers/). Rename the category.`
    );
  }
}
