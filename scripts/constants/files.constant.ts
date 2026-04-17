/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Files available in the template.
 * These files aimed to be copied to the build folder.
 */
export const TEMPLATE_CATEGORY_FILES = {
  LICENSE: "LICENSE.md",
  PACKAGE_JSON: "package.json",
  README: "README.md"
};

/**
 * Files available in the template that are transient, without any modification
 * needed.
 * These files are copied as-is to the build folder.
 * They are not modified or processed in any way.
 */
export const TEMPLATE_CATEGORY_STATIC_FILES = [
  TEMPLATE_CATEGORY_FILES.LICENSE
];