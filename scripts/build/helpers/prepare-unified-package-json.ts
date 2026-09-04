/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { join } from "node:path";
import { DIR } from "../../constants";
import { readFileJson, writeFile } from "../../utils";

/**
 * Prepare the package.json for the unified `helpers4` package.
 *
 * Unlike the `@helpers4/all` bundle (peerDependencies + no code), this package ships real
 * `dependencies` on every category — `npm install helpers4` alone must be enough to get
 * every category, no follow-up peer-dependency install required. There is intentionally no
 * `"."` export: the package root has no code, only `helpers4/<category>` subpaths resolve.
 * @param buildUnifiedDir - The build unified package directory.
 * @param categories - The list of available categories.
 */
export async function prepareUnifiedPackageJson(
  buildUnifiedDir: string,
  categories: string[]
) {
  const rootPackage = readFileJson<Record<string, unknown>>(join(DIR.ROOT, "package.json"));
  const templatePackage = readFileJson<Record<string, unknown>>(join(DIR.TEMPLATE_UNIFIED, "package.json"));

  const version = rootPackage.version as string;

  const dependencies = categories.reduce<Record<string, string>>((acc, category) => {
    acc[`@helpers4/${category}`] = version;
    return acc;
  }, {});

  const exports: Record<string, unknown> = {
    "./package.json": "./package.json",
    "./llms.txt": "./llms.txt"
  };
  const files = ["package.json", "README.md", "LICENSE.md", "meta/", "llms.txt"];

  for (const category of categories.toSorted()) {
    exports[`./${category}`] = {
      types: `./${category}/index.d.ts`,
      import: `./${category}/index.js`
    };
    exports[`./${category}/llms.txt`] = `./${category}/llms.txt`;
    files.push(`${category}/`);
  }

  // Clone the template and update the values
  const packageJson = {
    ...templatePackage,
    version,
    dependencies,
    exports,
    files
  };

  writeFile(join(buildUnifiedDir, "package.json"), JSON.stringify(packageJson, null, 2));
}
