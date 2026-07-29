/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { readFileSync } from 'node:fs';
import { stripJsonComments } from './_stripJsonComments';

/**
 * Reads a file and parses its contents as JSON, returning `null` (or a
 * fallback) on any failure — a missing/unreadable file and invalid content
 * are both treated the same way.
 *
 * Also tolerates JSONC (line/block comments and trailing commas — the
 * dialect used by `tsconfig.json`, VS Code's `settings.json`, etc.): strict
 * `JSON.parse` is tried first, and only on failure is the content re-parsed
 * with comments/trailing commas stripped, so plain JSON pays no extra cost.
 *
 * Unlike `readFileSync` + `JSON.parse`, this never throws.
 *
 * @param filePath - Path to the JSON (or JSONC) file to read.
 * @param fallback - Value returned on failure. Defaults to `null` when omitted.
 * @returns The parsed value typed as `T`, or `fallback` on failure.
 * @example
 * safeReadJsonFile<{ name: string }>('./package.json') // => { name: 'helpers4', ... }
 * safeReadJsonFile('./missing.json')                   // => null
 * safeReadJsonFile('./missing.json', {})               // => {}
 * @example
 * // tsconfig.json-style JSONC (comments + trailing comma) also parses:
 * safeReadJsonFile('./tsconfig.json') // => { compilerOptions: { strict: true }, ... }
 * @since 3.0.6
 */
export function safeReadJsonFile<T>(filePath: string): T | null;
export function safeReadJsonFile<T>(filePath: string, fallback: T): T;
export function safeReadJsonFile<T>(filePath: string, fallback?: T): T | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    try {
      return JSON.parse(content) as T;
    } catch {
      // Not strict JSON — retry tolerating JSONC comments/trailing commas
      // before giving up.
      return JSON.parse(stripJsonComments(content)) as T;
    }
  } catch {
    // Distinguish "no fallback provided" (→ null) from "fallback is undefined"
    // (→ undefined as T) to keep runtime behaviour aligned with the overloads.
    return arguments.length < 2 ? null : (fallback as T);
  }
}
