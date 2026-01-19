/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { deepMerge } from "./deepMerge";

describe("deepMerge", () => {
  it("should merge objects deeply", () => {
    const target = { a: 1, b: { c: 2, d: 3 } };
    const source = { b: { c: 4, e: 5 }, f: 6 };

    const result = deepMerge(target, source);

    expect(result).toEqual({
      a: 1,
      b: { c: 4, d: 3, e: 5 },
      f: 6
    });
  });

  it("should handle multiple sources", () => {
    const target = { a: 1 };
    const source1 = { b: 2 };
    const source2 = { c: 3 };

    const result = deepMerge(target, source1, source2);

    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  it("should not mutate original objects", () => {
    const target = { a: 1, b: { c: 2 } };
    const source = { b: { d: 3 } };

    deepMerge(target, source);

    expect(target.b).toHaveProperty('d', 3);
    expect(target.b).toHaveProperty('c', 2);
  });
});
