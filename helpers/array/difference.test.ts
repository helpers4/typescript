/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { difference } from "./difference";

describe("difference", () => {
  it("should return items in first array but not in second", () => {
    expect(difference([1, 2, 3, 4], [2, 4])).toEqual([1, 3]);
  });

  it("should work with strings", () => {
    expect(difference(['a', 'b', 'c'], ['b'])).toEqual(['a', 'c']);
  });

  it("should return empty array when all items are common", () => {
    expect(difference([1, 2, 3], [1, 2, 3, 4])).toEqual([]);
  });

  it("should return first array when no items are common", () => {
    expect(difference([1, 2, 3], [4, 5, 6])).toEqual([1, 2, 3]);
  });

  it("should work with empty arrays", () => {
    expect(difference([], [1, 2])).toEqual([]);
    expect(difference([1, 2], [])).toEqual([1, 2]);
  });
});
