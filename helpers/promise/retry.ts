/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Retries a promise-returning function up to maxAttempts times
 * @param fn - The function to retry
 * @param maxAttempts - Maximum number of attempts
 * @param delayMs - Delay between attempts in milliseconds
 * @returns Promise that resolves with the result or rejects with the last error
 * @since 1.9.0
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxAttempts) {
        break;
      }

      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  throw lastError!;
}
