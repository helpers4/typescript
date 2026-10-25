/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { copy } from "fs-extra";
import { basename, join } from "node:path";
import { BUILD, DIR } from "../../constants";

/**
 * Copy the built `@helpers4/presets` files into the unified package, under `presets/`.
 *
 * A copy, not a re-export shim like the categories get: tsconfig, oxlint and cspell read these
 * files by path through `extends`/`import`, so they must exist inside `helpers4` itself.
 * @param buildUnifiedDir - The build unified package directory.
 */
export async function copyUnifiedPresets(buildUnifiedDir: string) {
  await copy(join(DIR.BUILD, BUILD.PRESETS_NAME), join(buildUnifiedDir, BUILD.PRESETS_NAME), {
    filter: source => !["package.json", "README.md", "LICENSE.md"].includes(basename(source))
  });
}
