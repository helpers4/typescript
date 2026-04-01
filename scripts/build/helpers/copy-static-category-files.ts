/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { copyFile } from "node:fs/promises";
import { join } from "node:path";
import { DIR, TEMPLATE_CATEGORY_STATIC_FILES } from "../../constants";

/**
 * Copy static files from the template directory to the build category directory.
 * @param buildCategoryDir - The build category directory.
 */
export async function copyStaticCategoryFiles(buildCategoryDir: string) {
    for (const file of TEMPLATE_CATEGORY_STATIC_FILES) {
        await copyFile(join(DIR.TEMPLATE_CATEGORY, file), join(buildCategoryDir, file));
    }
}
