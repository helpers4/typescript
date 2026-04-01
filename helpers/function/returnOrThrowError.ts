/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isDefinedAndNotNull } from './isDefinedAndNotNull';

/**
 * Return a value or throw an error is null or undefined.
 *
 * @param value A possible non-defined value.
 * @param error The error message to throw.
 * @returns A defined value or an error.
 */
export function returnOrThrowError<T>(value: T | undefined | null, error: string): T {
    if (isDefinedAndNotNull(value)) {
        return value!;
    } else {
        throw new Error(error);
    }
}
