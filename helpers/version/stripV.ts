/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Strip the leading "v" from a version string if it exists.
 * 
 * @param version - The version string to process
 * @returns The version string without leading "v", or the original value if it's not a string or doesn't start with "v"
 * 
 * @example
 * ```typescript
 * stripV("v1.2.3")     // "1.2.3"
 * stripV("1.2.3")      // "1.2.3"
 * stripV("v20.1.0")    // "20.1.0"
 * stripV(null)         // null
 * stripV(undefined)    // undefined
 * stripV("")           // ""
 * stripV("1.0.0-beta") // "1.0.0-beta"
 * ```
 */
export function stripV(version: string): string;
export function stripV(version: null): null;
export function stripV(version: undefined): undefined;
export function stripV(version: string | null | undefined): string | null | undefined {
  return typeof version === "string" && version.startsWith("v") ? version.slice(1) : version;
}
