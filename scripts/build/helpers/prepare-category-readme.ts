/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { join } from "node:path";
import { DIR } from "../../constants";
import { readFileText, writeFile } from "../../utils";
import { generateCategoriesTable } from "./categories-table.helper";

/**
 * Copy and prepare the README.md file for the build category directory.
 * @param buildCategoryDir - The build category directory.
 * @param category - The current category.
 * @param tsFiles - The list of TypeScript files.
 * @param categories - The list of all categories.
 */
export async function prepareCategoryReadme(buildCategoryDir: string, category: string, tsFiles: string[], categories: string[]) {
    const readmeTemplate = readFileText(join(DIR.TEMPLATE_CATEGORY, "README.md"));
    const methodsList = tsFiles.map(file => `- ${file.replace(".ts", "")}`).join("\n");
    const siblingsList = categories.filter(cat => cat !== category).map(cat => `- [${cat}](../${cat})`).join("\n");
    const categoriesTable = await generateCategoriesTable(categories);

    const readmeContent = readmeTemplate
        .replace(/{{category}}/g, category)
        .replace(/<!-- AUTOMATIC-METHODS -->[\s\S]*<!-- \/AUTOMATIC-METHODS -->/, `<!-- AUTOMATIC-METHODS -->\n${methodsList}\n<!-- /AUTOMATIC-METHODS -->`)
        .replace(/<!-- AUTOMATIC-SIBLINGS -->[\s\S]*<!-- \/AUTOMATIC-SIBLINGS -->/, `<!-- AUTOMATIC-SIBLINGS -->\n${siblingsList}\n<!-- /AUTOMATIC-SIBLINGS -->`)
        .replace(/<!-- AUTOMATIC-CATEGORIES-TABLE -->[\s\S]*<!-- \/AUTOMATIC-CATEGORIES-TABLE -->/, `<!-- AUTOMATIC-CATEGORIES-TABLE -->\n${categoriesTable}\n<!-- /AUTOMATIC-CATEGORIES-TABLE -->`);

    writeFile(join(buildCategoryDir, "README.md"), readmeContent);
}
