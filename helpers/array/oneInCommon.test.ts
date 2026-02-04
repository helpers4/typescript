/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { oneInCommon } from './oneInCommon';

describe('oneInCommon', () => {
    it('should return true if there is at least one item in common', () => {
        expect(oneInCommon([1, 2, 3], [3, 4, 5])).toBe(true);
    });

    it('should return false if there are no items in common', () => {
        expect(oneInCommon([1, 2, 3], [4, 5, 6])).toBe(false);
    });

    it('should return false if one of the arrays is empty', () => {
        expect(oneInCommon([1, 2, 3], [])).toBe(false);
    });
});
