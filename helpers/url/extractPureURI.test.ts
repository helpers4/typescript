/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/*
 * This program is under the terms of the GNU Lesser General Public License version 3
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { describe, expect, test } from "vitest";
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

    // --- Mutation-killing tests ---

    // L38: ConditionalExpression -> true (queryIndex !== -1 && fragmentIndex !== -1 always true)
    // If true, URLs with only query OR only fragment would enter the Math.min branch
    test("should handle URL with only query (no fragment)", () => {
        expect(extractPureURI("path?query")).toBe("path");
        expect(extractPureURI("www.example.com/page?x=1")).toBe("www.example.com/page");
    });

    test("should handle URL with only fragment (no query)", () => {
        expect(extractPureURI("path#section")).toBe("path");
        expect(extractPureURI("www.example.com/page#top")).toBe("www.example.com/page");
    });

    // L38: UnaryOperator: -1 -> +1 (cutIndex set incorrectly)
    // If Math.min returns wrong index due to +1, the substring would be off
    test("should cut at earliest of query and fragment", () => {
        // Query before fragment
        expect(extractPureURI("a?b#c")).toBe("a");
        // Fragment before query
        expect(extractPureURI("a#b?c")).toBe("a");
        // Verify the cut is at index 1 (the 'a' only)
        expect(extractPureURI("ab?c#d")).toBe("ab");
        expect(extractPureURI("ab#c?d")).toBe("ab");
    });

    describe('security edge cases', () => {
        test('should handle javascript: protocol URI', () => {
            expect(extractPureURI('javascript:alert(1)')).toBe('javascript:alert(1)');
        });

        test('should handle data: URI', () => {
            expect(extractPureURI('data:text/html,<script>alert(1)</script>')).toBe('data:text/html,<script>alert(1)</script>');
        });

        test('should handle URL with credentials', () => {
            expect(extractPureURI('https://user:pass@evil.com/path?q=1')).toBe('https://user:pass@evil.com/path');
        });

        test('should handle double-encoded characters', () => {
            expect(extractPureURI('/path%252F..%252F..%252Fetc%252Fpasswd?x=1')).toBe('/path%252F..%252F..%252Fetc%252Fpasswd');
        });

        test('should handle null bytes in URL', () => {
            expect(extractPureURI('/path%00evil?q=1')).toBe('/path%00evil');
        });

        test('should handle protocol-relative URL', () => {
            expect(extractPureURI('//evil.com/path?q=1')).toBe('//evil.com/path');
        });
    });
});
