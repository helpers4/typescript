/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Returns a function that passes through meaningful data or throws an error.
 * Data is considered meaningless if it is null, undefined, empty string, empty object, or empty array.
 * @param error - The error message to throw if data is meaningless
 * @returns A function that returns the data if meaningful, or throws
 * @since 1.0.0
 */
export function meaningPromiseOrThrow<T>(
  error: string
): (data: T) => T | never {
  return (data: T) => {
    if (isMeaningless(data)) {
      throw new Error(error); // eslint-disable-line functional/no-throw-statement
    }
    return data;
  };
}

function isMeaningless(value: unknown): boolean {
  if (value === undefined || value === null || value === '') return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') {
    return Object.keys(value).length === 0 && Object.getPrototypeOf(value) === Object.prototype;
  }
  return false;
}
