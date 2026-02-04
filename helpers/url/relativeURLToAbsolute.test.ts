/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/*
 * This program is under the terms of the GNU Affero General Public License version 3
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { expect, test, describe } from "vitest";
import { relativeURLToAbsolute } from "./relativeURLToAbsolute";

describe('relativeURLToAbsolute', () => {
    test("should use document.baseURI first", () => {
        global.document = {
            ...document,
            baseURI: "https://www.document.baseURI.com",
        };
        global.window = {
            ...window,
            location: {
                ...window.location,
                origin: "https://www.window.location.origin.com",
            },
        } as unknown as Window & typeof globalThis;

        expect(relativeURLToAbsolute("/test-url")).toBe(
            `${document.baseURI}/test-url`
        );
    });

    test("should use window.location.origin secondly", () => {
        global.document = {
            ...document,
            baseURI: undefined as unknown as string,
        };
        global.window = {
            ...window,
            location: {
                ...window.location,
                origin: "https://www.window.location.origin.com",
            },
        } as unknown as Window & typeof globalThis;

        expect(relativeURLToAbsolute("/test-url")).toBe(
            `${window.location.origin}/test-url`
        );
    });

    test("should clean URL", () => {
        global.document = {
            ...document,
            baseURI: "https://www.document.baseURI.com",
        };

        expect(relativeURLToAbsolute("test-url/////test")).toBe(
            `${document.baseURI}/test-url/test`
        );
    });
});
