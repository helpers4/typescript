/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { copy, ensureDir } from "fs-extra";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { BUILD, DIR } from "../constants";
import { readFileJson, writeFile } from "../utils";
import { compileTypeScript } from "./helpers";

/**
 * Build the `@helpers4/presets` package: shared tool configs, not helpers.
 *
 * JSON and plain files are copied as they are, the `.ts` config factories (`vitest.ts`,
 * `stryker.ts`) are compiled to `.js` + `.d.ts`, and the version is the root one, like every
 * other package. Unlike a category, there is no `lib/`, no `meta/` and no index.
 */
export async function buildPresets(): Promise<void> {
  const buildPresetsDir = join(DIR.BUILD, BUILD.PRESETS_NAME);
  await ensureDir(buildPresetsDir);

  const entries = await readdir(DIR.PRESETS, { withFileTypes: true });
  for (const entry of entries) {
    const source = join(DIR.PRESETS, entry.name);
    if (entry.name === "package.json" || entry.name.endsWith(".test.ts")) {
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".ts")) {
      await compileTypeScript(source, buildPresetsDir);
    } else {
      await copy(source, join(buildPresetsDir, entry.name));
    }
  }

  await copy(join(DIR.TEMPLATE_CATEGORY, "LICENSE.md"), join(buildPresetsDir, "LICENSE.md"));

  const rootPackage = readFileJson<Record<string, unknown>>(join(DIR.ROOT, "package.json"));
  const presetsPackage = readFileJson<Record<string, unknown>>(join(DIR.PRESETS, "package.json"));
  writeFile(
    join(buildPresetsDir, "package.json"),
    JSON.stringify({ ...presetsPackage, version: rootPackage.version }, null, 2)
  );

  console.info(" ✔️⚙️ Built presets package (@helpers4/presets)");
}
