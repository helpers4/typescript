/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Checks if a timestamp is likely in seconds (Java/Unix style) vs milliseconds (JavaScript style)
 * @param timestamp - The timestamp to check
 * @returns True if timestamp appears to be in seconds
 * @since 1.9.0
 */
export function isTimestampInSeconds(timestamp: number): boolean {
  // Timestamps before year 2001 in milliseconds are less than 10^10
  // Use Math.abs to correctly handle negative timestamps (before epoch)
  return Math.abs(timestamp) < 10000000000;
}

/**
 * Converts a timestamp to JavaScript milliseconds format
 * @param timestamp - The timestamp (in seconds or milliseconds)
 * @returns Timestamp in milliseconds
 * @since 1.9.0
 */
export function normalizeTimestamp(timestamp: number): number {
  return isTimestampInSeconds(timestamp) ? timestamp * 1000 : timestamp;
}
