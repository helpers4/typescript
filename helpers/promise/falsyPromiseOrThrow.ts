/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Returns a function that passes through falsy data or throws an error.
 * @param error - The error message to throw if data is truthy
 * @returns A function that returns the data if falsy, or throws
 * @since 1.0.0
 */
export function falsyPromiseOrThrow<T>(error: string): (data: T) => T | never {
  return (data: T) => {
    if (data) {
      throw new Error(error); // eslint-disable-line functional/no-throw-statement
    }
    return data;
  };
}
