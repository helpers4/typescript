/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Creates a promise that resolves after specified delay
 * @param ms - Milliseconds to delay
 * @param value - Optional value to resolve with
 * @returns Promise that resolves after delay
 * @since 1.9.0
 */
export function delay<T = void>(ms: number, value?: T): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => resolve(value as T), ms);
  });
}
