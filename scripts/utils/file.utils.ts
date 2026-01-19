/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { readFileSync, writeFileSync } from "node:fs";

/**
 * Read a file and return its content as text
 */
export function readFileText(filePath: string): string {
  return readFileSync(filePath, 'utf-8');
}

/**
 * Read a file and parse it as JSON
 */
export function readFileJson<T = unknown>(filePath: string): T {
  const content = readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

/**
 * Write content to a file
 */
export function writeFile(filePath: string, content: string): void {
  writeFileSync(filePath, content, 'utf-8');
}
