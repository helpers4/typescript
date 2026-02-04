/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { removeUndefinedNull } from './removeUndefinedNull';

describe('removeUndefinedNull', () => {
    it('should remove null and undefined values from an object', () => {
        const input = { a: 1, b: null, c: undefined, d: 'test', e: false };
        const expected = { a: 1, d: 'test', e: false };
        expect(removeUndefinedNull(input)).toEqual(expected);
    });

    it('should return null if input is null', () => {
        expect(removeUndefinedNull(null)).toBeNull();
    });

    it('should return undefined if input is undefined', () => {
        expect(removeUndefinedNull(undefined)).toBeUndefined();
    });

    it('should return an empty object if all values are null or undefined', () => {
        const input = { a: null, b: undefined };
        const expected = {};
        expect(removeUndefinedNull(input)).toEqual(expected);
    });

    it('should not remove false or 0 values', () => {
        const input = { a: false, b: 0, c: null, d: undefined };
        const expected = { a: false, b: 0 };
        expect(removeUndefinedNull(input)).toEqual(expected);
    });
});
