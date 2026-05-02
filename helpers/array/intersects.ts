/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Simple helper that check if two lists shared at least an item in common.
 *
 * @param a One list
 * @param b Another list
 * @returns `true` if one item is in common, `false` otherwise.
 * @since 1.0.0
 */
export function intersects<T>(a: readonly T[], b: readonly T[]): boolean {
    return a.some((i) => b.includes(i));
}
