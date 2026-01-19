/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { join, basename } from "node:path";
import { writeFile } from "../../utils";

/**
 * Create an index.ts file that re-exports all matched .ts files in the category.
 * Uses simple re-exports which work well with our bundling approach.
 * 
 * Note: the .gitignore rules should ignore this index.ts file, so it doesn't
 * get committed.
 * 
 * @param categoryPath - The path of the category.
 * @param tsFiles - The list of TypeScript files.
 * @returns The path of the created index.ts file.
 */
export async function createIndexFile(categoryPath: string, tsFiles: string[]) {
    // Create simple re-exports for all files
    const indexContent = tsFiles
        .map(file => `export * from './${basename(file, ".ts")}';`)
        .join("\n") + "\n";

    const indexPath = join(categoryPath, "index.ts");
    writeFile(indexPath, indexContent);
    return indexPath;
}