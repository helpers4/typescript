/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { copy } from "fs-extra";
import { join } from "node:path";
import { DIR } from "../../constants";

/**
 * Copy static files for the bundle (LICENSE.md).
 * @param buildBundleDir - The build bundle directory.
 */
export async function copyStaticBundleFiles(buildBundleDir: string) {
  // Copy LICENSE.md from template
  await copy(
    join(DIR.TEMPLATE_BUNDLE, "LICENSE.md"),
    join(buildBundleDir, "LICENSE.md")
  );
}
