/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { join } from "node:path";
import { DIR } from "../../constants";
import { readFileJson } from "../../utils";

/**
 * Category configuration interface
 */
interface CategoryConfig {
  label: string;
  smallDescription: string;
  description: string;
}

/**
 * Generate a markdown table with category information
 * @param categories - List of category names
 * @returns Markdown table string
 */
export async function generateCategoriesTable(categories: string[]): Promise<string> {
  if (categories.length === 0) {
    return "";
  }

  const tableHeader = `| Name | Package | Source Code | Description |
|------|---------|-------------|-------------|`;

  const tableRows = await Promise.all(
    categories.map(async (category) => {
      const config = readFileJson<CategoryConfig>(join(DIR.HELPERS, category, "config.json"));
      const packageName = `@helpers4/${category}`;
      const npmUrl = `https://www.npmjs.com/package/@helpers4/${category}`;
      const sourceUrl = `https://github.com/helpers4/helpers4/tree/main/helpers/${category}`;
      const description = config?.smallDescription || `${category} utilities`;

      return `| ${category} | [${packageName}](${npmUrl}) | [Source](${sourceUrl}) | ${description} |`;
    })
  );

  return `${tableHeader}\n${tableRows.join('\n')}`;
}
