/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Creates a debounced function that delays invoking func until after delay milliseconds have elapsed since the last time the debounced function was invoked
 * @param func - The function to debounce
 * @param delay - The number of milliseconds to delay
 * @returns The debounced function
 * @since 1.9.0
 */
export function debounce<A extends unknown[], R>(
  func: (...args: A) => R,
  delay: number
): (...args: A) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: A) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
