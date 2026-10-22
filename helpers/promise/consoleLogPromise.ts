/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Returns a function that logs data to the console and passes it through.
 * @param prefix - Optional prefix for the console log
 * @returns A function that logs and returns the data
 * @since 1.0.0
 */
export function consoleLogPromise<T>(prefix?: string): (data: T) => T {
    return (data: T) => {
        console.log(prefix, data);
        return data;
    };
}
