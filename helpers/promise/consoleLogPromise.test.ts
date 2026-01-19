/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { expect, test, vi } from "vitest";
import { consoleLogPromise } from "./consoleLogPromise";

// -- consoleLogPromise --------------------------------------------------------

const prefix = "My custom error message";

[
    { value: undefined, label: "undefined" },
    { value: null, label: "null" },
    { value: "string", label: "string" },
    { value: 42, label: "number" },
].forEach(({ value, label }) => {
    test("consoleLogPromise logs " + label, async () => {
        const spy = vi.spyOn(console, "log");
        await Promise.resolve(value).then(consoleLogPromise(prefix));
        expect(spy).toHaveBeenCalledWith(prefix, value);
        spy.mockRestore();
    });
});
