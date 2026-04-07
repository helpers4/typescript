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
    return (data: unknown) => {
        if (
            data === undefined ||
            data === null ||
            data === '' ||
            isEmptyObject(data) ||
            // eslint-disable-next-line functional/prefer-readonly-type, @typescript-eslint/no-explicit-any
            isEmptyArray(data as any[])
        ) {
            // eslint-disable-next-line functional/no-throw-statement
            throw new Error(error);
        } else {
            return data as T;
        }
    };
}

// eslint-disable-next-line @typescript-eslint/ban-types
function isEmptyObject(obj: object): boolean {
    return (
        Object.keys(obj).length === 0 &&
        Object.getPrototypeOf(obj) === Object.prototype
    );
}

// eslint-disable-next-line functional/prefer-readonly-type, @typescript-eslint/no-explicit-any
function isEmptyArray(arr: any[]): boolean {
    return arr.constructor === Array && arr.length === 0;
}
