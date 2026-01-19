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
 * Copy and prepare the README.md file for the bundle directory.
 * @param buildBundleDir - The build bundle directory.
 * @param categories - The list of available categories.
 */
export async function prepareBundleReadme(
  buildBundleDir: string,
  categories: string[]
) {
  // Read the template README
  const templateReadme = readFileText(join(DIR.TEMPLATE_BUNDLE, "README.md"));

  // Generate the categories list
  const categoriesList = categories
    .map(category => `- **@helpers4/${category}**: ${category} utilities`)
    .join('\n');

  // Generate the individual packages list
  const individualPackagesList = categories
    .map(category => `- \`pnpm install @helpers4/${category}\``)
    .join('\n');

  // Generate the categories table
  const categoriesTable = await generateCategoriesTable(categories);

  // Replace placeholders
  const readme = templateReadme
    .replace('{{categories}}', categoriesList)
    .replace('{{individual_packages}}', individualPackagesList)
    .replace('{{categories_table}}', categoriesTable);

  writeFile(join(buildBundleDir, "README.md"), readme);
}
