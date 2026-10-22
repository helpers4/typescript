/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { copy } from "fs-extra";
import { join } from "node:path";
import { DIR } from "../../constants";

/**
 * Copy static files for the unified package (LICENSE.md).
 * @param buildUnifiedDir - The build unified package directory.
 */
export async function copyStaticUnifiedFiles(buildUnifiedDir: string) {
  await copy(
    join(DIR.TEMPLATE_UNIFIED, "LICENSE.md"),
    join(buildUnifiedDir, "LICENSE.md")
  );
}
