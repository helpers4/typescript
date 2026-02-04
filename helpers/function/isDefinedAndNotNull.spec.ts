/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { isDefinedAndNotNull } from "./isDefinedAndNotNull";

describe("isDefinedAndNotNull", () => {
    it("should return true when value is defined", () => {
        expect(isDefinedAndNotNull("a string")).toBeTruthy();
        expect(isDefinedAndNotNull("")).toBeTruthy();
        expect(isDefinedAndNotNull(0)).toBeTruthy();
        expect(isDefinedAndNotNull(0.5)).toBeTruthy();
        expect(isDefinedAndNotNull(true)).toBeTruthy();
        expect(isDefinedAndNotNull(false)).toBeTruthy();
        expect(isDefinedAndNotNull({})).toBeTruthy();
    });

    it("should return false when value is undefined or null", () => {
        expect(isDefinedAndNotNull(undefined)).toBeFalsy();
        expect(isDefinedAndNotNull(null)).toBeFalsy();
    });
});
