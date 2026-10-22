/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { readFileSync, writeFileSync } from "node:fs";
import { readdir } from "node:fs/promises";

/**
 * Read a file and return its content as text
 */
export function readFileText(filePath: string): string {
  return readFileSync(filePath, 'utf8');
}

/**
 * Lists the published helper category directory names under `helpersDir`
 * (e.g. `array`, `color`, `guard`), sorted alphabetically.
 *
 * Skips `_`-prefixed internal directories (e.g. `_shared`, which holds code
 * shared between categories but isn't itself a published package) and any
 * non-directory entries.
 */
export async function listHelperCategories(helpersDir: string): Promise<string[]> {
  const entries = await readdir(helpersDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
    .map((entry) => entry.name)
    .toSorted();
}

/**
 * Read a file and parse it as JSON
 */
export function readFileJson<T = unknown>(filePath: string): T {
  const content = readFileSync(filePath, 'utf8');
  return JSON.parse(content) as T;
}

/**
 * Write content to a file
 */
export function writeFile(filePath: string, content: string): void {
  writeFileSync(filePath, content, 'utf8');
}
