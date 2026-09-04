/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { join } from "node:path";
import { DIR } from "../../constants";
import { readFileText, writeFile } from "../../utils";
import { generateCategoriesTable } from "./categories-table.helper";

/**
 * Copy and prepare the README.md file for the unified package directory.
 * @param buildUnifiedDir - The build unified package directory.
 * @param categories - The list of available categories.
 */
export async function prepareUnifiedReadme(
  buildUnifiedDir: string,
  categories: string[]
) {
  const templateReadme = readFileText(join(DIR.TEMPLATE_UNIFIED, "README.md"));
  const categoriesTable = await generateCategoriesTable(categories);

  const readme = templateReadme.replace('{{categories_table}}', categoriesTable);

  writeFile(join(buildUnifiedDir, "README.md"), readme);
}
