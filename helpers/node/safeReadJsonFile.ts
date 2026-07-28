/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { readFileSync } from 'node:fs';

/**
 * Reads a file and parses its contents as JSON, returning `null` (or a
 * fallback) on any failure — a missing/unreadable file and invalid JSON
 * content are both treated the same way.
 *
 * Unlike `readFileSync` + `JSON.parse`, this never throws.
 *
 * @param filePath - Path to the JSON file to read.
 * @param fallback - Value returned on failure. Defaults to `null` when omitted.
 * @returns The parsed value typed as `T`, or `fallback` on failure.
 * @example
 * safeReadJsonFile<{ name: string }>('./package.json') // => { name: 'helpers4', ... }
 * safeReadJsonFile('./missing.json')                   // => null
 * safeReadJsonFile('./missing.json', {})               // => {}
 * @since next
 */
export function safeReadJsonFile<T>(filePath: string): T | null;
export function safeReadJsonFile<T>(filePath: string, fallback: T): T;
export function safeReadJsonFile<T>(filePath: string, fallback?: T): T | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch {
    // Distinguish "no fallback provided" (→ null) from "fallback is undefined"
    // (→ undefined as T) to keep runtime behaviour aligned with the overloads.
    return arguments.length < 2 ? null : (fallback as T);
  }
}
