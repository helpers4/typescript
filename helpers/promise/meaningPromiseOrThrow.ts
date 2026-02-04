/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/*
 * This program is under the terms of the GNU Affero General Public License version 3
 * The full license information can be found in LICENSE in the root directory of this project.
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
