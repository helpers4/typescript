/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test } from "vitest";
import { truthyPromiseOrThrow } from "./truthyPromiseOrThrow";

// -- truthyPromiseOrThrow ----------------------------------------------------

[
    { value: undefined, label: "undefined" },
    { value: null, label: "null" },
    { value: "", label: "empty string" },
    { value: false, label: "false" },
    { value: 0, label: "zero" },
].forEach(({ value, label }) => {
    test("truthyPromiseOrThrow intercepts " + label, async () => {
        const message = "My custom error message";
        const result = await Promise.resolve(value)
            .then(truthyPromiseOrThrow(message))
            .catch((e) => e.message);
        return expect(result).toBe(message);
    });
});

[
    { value: "some string", label: "string" },
    { value: true, label: "true" },
    { value: 42, label: "number" },
    { value: [], label: "empty array" },
    { value: [42], label: "array" },
    { value: {}, label: "empty object" },
    { value: { prop: 42 }, label: "object" },
].forEach(({ value, label }) => {
    test("truthyPromiseOrThrow ignores " + label, async () => {
        const message = "My custom error message";
        const result = await Promise.resolve(value)
            .then(truthyPromiseOrThrow(message))
            .catch((e) => e.message);
        return expect(result).toBe(value);
    });
});
