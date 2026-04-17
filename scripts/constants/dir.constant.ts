/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { join } from "node:path";

/**
 * Directories used in the project.
 */
export const DIR = {
  BUILD: join("./", "build"),
  HELPERS: join("./", "helpers"),
  ROOT: "./",
  TEMPLATE: join("./", ".template"),
  TEMPLATE_BUNDLE: join("./", ".template", "bundle"),
  TEMPLATE_CATEGORY: join("./", ".template", "category")
};
