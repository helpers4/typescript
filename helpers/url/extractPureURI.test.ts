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
import { extractPureURI } from "./extractPureURI";

describe('extractPureURI', () => {
    test("should extract URI from URL with query", () =>
        expect(extractPureURI("www.foo.com/api/?=bar")).toBe("www.foo.com/api/"));
    test("should extract URI from URL with fragment", () =>
        expect(extractPureURI("www.foo.com/api/#userInfos")).toBe(
            "www.foo.com/api/"
        ));
    test("should extract URI from URL with both query and fragment, taking query first", () =>
        expect(extractPureURI("www.foo.com/api/?param=1#anchor")).toBe(
            "www.foo.com/api/"
        ));
    test("should extract URI from URL with both query and fragment, taking fragment first", () =>
        expect(extractPureURI("www.foo.com/api/#anchor?param=1")).toBe(
            "www.foo.com/api/"
        ));
    test("should do nothing from empty string", () =>
        expect(extractPureURI("")).toBe(""));
    test("should do nothing from standalone slash", () =>
        expect(extractPureURI("/")).toBe("/"));
    test("should do nothing from simple text", () =>
        expect(extractPureURI("text-without-slash")).toBe("text-without-slash"));
    test("should do nothing from slashes", () =>
        expect(extractPureURI("/////////")).toBe("/////////"));
    test("should handle undefined", () =>
        expect(extractPureURI(undefined)).toBe(undefined));
    test("should handle null", () =>
        expect(extractPureURI(null)).toBe(null));
    test("should handle URL with only fragment and query together", () =>
        expect(extractPureURI("path#anchor?query")).toBe("path"));
});
