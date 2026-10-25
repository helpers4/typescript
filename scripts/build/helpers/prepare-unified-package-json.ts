/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { join } from "node:path";
import { BUILD, DIR } from "../../constants";
import { readFileJson, writeFile } from "../../utils";

/**
 * Prepare the package.json for the unified `helpers4` package.
 *
 * Unlike the `@helpers4/all` bundle (peerDependencies + no code), this package ships real
 * `dependencies` on every category — `npm install helpers4` alone must be enough to get
 * every category, no follow-up peer-dependency install required. There is intentionally no
 * `"."` export: the package root has no code, only `helpers4/<category>` subpaths resolve.
 *
 * `helpers4/presets/*` serves a copy of `@helpers4/presets` (see `copyUnifiedPresets`): a
 * re-export shim cannot stand in for a JSON file that a tool reads through `extends`.
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

  const dependencies = [...categories, BUILD.PRESETS_NAME].reduce<Record<string, string>>((acc, name) => {
    acc[`@helpers4/${name}`] = version;
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

  // Same subpaths as @helpers4/presets, one level down: "./vitest" becomes "./presets/vitest".
  const presetsPackage = readFileJson<{ exports: Record<string, unknown> }>(join(DIR.PRESETS, "package.json"));
  for (const [subpath, target] of Object.entries(presetsPackage.exports)) {
    if (subpath === "./package.json") {
      continue;
    }
    exports[`./${BUILD.PRESETS_NAME}/${subpath.slice(2)}`] = prefixExportTarget(target, `./${BUILD.PRESETS_NAME}/`);
  }
  files.push(`${BUILD.PRESETS_NAME}/`);

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

/**
 * Move an `exports` target (a path, or a conditions object of paths) under a sub-directory.
 * @param target - The `exports` target, whose paths start with `./`
 * @param prefix - The sub-directory, ending with `/`
 * @returns The same target with every path under `prefix`
 */
function prefixExportTarget(target: unknown, prefix: string): unknown {
  if (typeof target === "string") {
    return `${prefix}${target.slice(2)}`;
  }
  return Object.fromEntries(
    Object.entries(target as Record<string, unknown>).map(([condition, value]) => [condition, prefixExportTarget(value, prefix)])
  );
}
