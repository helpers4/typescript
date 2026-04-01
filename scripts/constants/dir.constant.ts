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
  ROOT: "./",
  BUILD: join("./", "build"),
  HELPERS: join("./", "helpers"),
  TEMPLATE: join("./", ".template"),
  TEMPLATE_CATEGORY: join("./", ".template", "category"),
  TEMPLATE_BUNDLE: join("./", ".template", "bundle")
};
