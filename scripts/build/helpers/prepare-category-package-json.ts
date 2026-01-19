/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { join } from "node:path";
import { DIR } from "../../constants";
import { readFileJson, writeFile } from "../../utils";

/**
 * Copy and prepare the package.json file for the build category directory.
 * @param buildCategoryDir - The build category directory.
 * @param category - The current category.
 * @param tsFiles - The list of TypeScript files.
 * @param externalDependencies - The list of external package dependencies.
 */
export async function prepareCategoryPackageJson(
  buildCategoryDir: string,
  category: string,
  tsFiles: string[],
  externalDependencies: string[] = []
) {
  const rootPackage = readFileJson<Record<string, unknown>>(join(DIR.ROOT, "package.json"));
  const templatePackage = readFileJson<Record<string, unknown>>(join(DIR.TEMPLATE_CATEGORY, "package.json"));

  const version = rootPackage.version as string;
  const methods = tsFiles.map(file => file.replace(".ts", ""));

  // Clone the template and update the values
  const packageJson: Record<string, unknown> = {
    ...templatePackage,
    version,
    name: (templatePackage.name as string)?.replace(/{{category}}/g, category),
    description: (templatePackage.description as string)?.replace(/{{category}}/g, category),
    keywords: (templatePackage.keywords as string[])?.flatMap((keyword: string) =>
      keyword === "{{category}}" ? category :
        keyword === "{{methods}}" ? methods :
          keyword
    )
  };

  // Filter dependencies that exist in root package.json
  const rootDeps = rootPackage.dependencies as Record<string, string> | undefined;
  const rootDevDeps = rootPackage.devDependencies as Record<string, string> | undefined;

  const peerDependencies = externalDependencies
    // Map to [dep, version] pairs
    // The version comes from root package.json
    .map(dep => [dep, rootDeps?.[dep] || rootDevDeps?.[dep]])
    // Filter out any dependencies that don't exist in the root package.json
    .filter(([, version]) => !!version)
    // Reduce to an object { dep: version }
    .reduce<Record<string, string>>((acc, [dep, version]) => {
      acc[dep] = version as string;
      return acc;
    }, {});

  // Add peerDependencies only if there are any keys
  if (Object.keys(peerDependencies).length > 0) {
    packageJson.peerDependencies = peerDependencies;
  }

  writeFile(join(buildCategoryDir, "package.json"), JSON.stringify(packageJson, null, 2));
}
