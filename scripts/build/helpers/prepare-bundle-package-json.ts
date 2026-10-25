/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { join } from "node:path";
import { BUILD, DIR } from "../../constants";
import { readFileJson, writeFile } from "../../utils";

/**
 * Copy and prepare the package.json file for the bundle directory.
 * @param buildBundleDir - The build bundle directory.
 * @param categories - The list of available categories.
 */
export async function prepareBundlePackageJson(
  buildBundleDir: string,
  categories: string[]
) {
  const rootPackage = readFileJson<Record<string, unknown>>(join(DIR.ROOT, "package.json"));
  const templatePackage = readFileJson<Record<string, unknown>>(join(DIR.TEMPLATE_BUNDLE, "package.json"));

  const version = rootPackage.version as string;

  // Create peer dependencies object with all categories, plus the presets package
  const peerDependencies = [...categories, BUILD.PRESETS_NAME].reduce<Record<string, string>>((acc, name) => {
    acc[`@helpers4/${name}`] = version;
    return acc;
  }, {});

  // Clone the template and update the values
  const packageJson = {
    ...templatePackage,
    version,
    peerDependencies,
  };

  writeFile(join(buildBundleDir, "package.json"), JSON.stringify(packageJson, null, 2));
}
