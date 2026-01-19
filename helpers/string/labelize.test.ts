/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/*
 * This program is under the terms of the GNU Affero General Public License version 3
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { expect, test } from "vitest";
import { labelize } from "./labelize";

// -- labelize -----------------------------------------------------------------

[
    "oh_hi_mark!",
    "LiB-hElPeRs_DaTa/CaFé",
    "oh-hi-mark!",
    "oh hi mark!",
    "18-12-2022",
].forEach((testString) => {
    test("labelize should work with " + testString, () => {
        const result = labelize(testString);

        expect(typeof result).toBe("string");
        expect(result.split(" ").length >= 2).toBeTruthy();
        expect(result.includes("-")).toBeFalsy();
        expect(result.includes("_")).toBeFalsy();
        expect(result.includes(" ")).toBeTruthy();

        result
            .split(" ")
            .forEach((word) => expect(word[0]).toBe(word[0].toUpperCase()));
    });
});
