/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { intersection } from './intersection';

describe('intersection', () => {
    it('should return the intersection of two arrays', () => {
        expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
    });

    it('should return an empty array if there is no intersection', () => {
        expect(intersection([1, 2, 3], [4, 5, 6])).toEqual([]);
    });

    it('should return the same array if both arrays are identical', () => {
        expect(intersection([1, 2, 3], [1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('returns [] when first arg is null', () => {
        expect(intersection(null, [1, 2, 3])).toEqual([]);
    });

    it('returns [] when second arg is null', () => {
        expect(intersection([1, 2, 3], null)).toEqual([]);
    });

    it('returns [] when both args are null', () => {
        expect(intersection(null, null)).toEqual([]);
    });

    it('returns [] when first arg is empty', () => {
        expect(intersection([], [1, 2, 3])).toEqual([]);
    });

    it('returns [] when second arg is empty', () => {
        expect(intersection([1, 2, 3], [])).toEqual([]);
    });

    it('returns [] when both args are empty', () => {
        expect(intersection([], [])).toEqual([]);
    });
});
