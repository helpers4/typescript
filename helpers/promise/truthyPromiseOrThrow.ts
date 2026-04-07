/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Returns a function that passes through truthy data or throws an error.
 * @param error - The error message to throw if data is falsy
 * @returns A function that returns the data if truthy, or throws
 * @since 1.0.0
 */
export function truthyPromiseOrThrow<T>(error: string): (data: T) => T | never {
    return (data: unknown) => {
        if (data) {
            return data as T;
        } else {
            // eslint-disable-next-line functional/no-throw-statement
            throw new Error(error);
        }
    };
}
