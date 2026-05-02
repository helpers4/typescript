/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { intersects } from './intersects';

describe('intersects', () => {
    it('should return true if there is at least one item in common', () => {
        expect(intersects([1, 2, 3], [3, 4, 5])).toBe(true);
    });

    it('should return false if there are no items in common', () => {
        expect(intersects([1, 2, 3], [4, 5, 6])).toBe(false);
    });

    it('should return false if one of the arrays is empty', () => {
        expect(intersects([1, 2, 3], [])).toBe(false);
    });
});
