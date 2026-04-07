/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/*
 * This program is under the terms of the GNU Lesser General Public License version 3
 * The full license information can be found in LICENSE in the root directory of this project.
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
