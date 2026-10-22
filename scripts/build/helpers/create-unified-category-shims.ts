/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { ensureDir } from "fs-extra";
import { join } from "node:path";
import { writeFile } from "../../utils";

/**
 * Write the `helpers4/<category>` re-export shim for every category.
 *
 * Each shim re-exports the already-compiled `@helpers4/<category>` package verbatim —
 * the compiled code lives in exactly one place (the category's own `build/<category>/lib`),
 * so `@helpers4/<category>` and `helpers4/<category>` can never drift apart. Tree-shaking
 * still works through the re-export as long as the consuming bundler respects `sideEffects: false`.
 * @param buildUnifiedDir - The build unified package directory.
 * @param categories - The list of available categories.
 */
export async function createUnifiedCategoryShims(
  buildUnifiedDir: string,
  categories: string[]
): Promise<void> {
  for (const category of categories) {
    const categoryDir = join(buildUnifiedDir, category);
    await ensureDir(categoryDir);

    const packageName = `@helpers4/${category}`;

    writeFile(join(categoryDir, "index.js"), `export * from "${packageName}";\n`);
    writeFile(join(categoryDir, "index.d.ts"), `export * from "${packageName}";\n`);
  }
}
