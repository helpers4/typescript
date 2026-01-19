/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { get } from "./get";

describe("get", () => {
  const obj = {
    a: {
      b: {
        c: 'value'
      }
    },
    x: [1, 2, { y: 'array-value' }]
  };

  it("should get nested value using dot notation", () => {
    expect(get(obj, 'a.b.c')).toBe('value');
  });

  it("should return default value for non-existent path", () => {
    expect(get(obj, 'a.b.d', 'default')).toBe('default');
  });

  it("should work with array indices", () => {
    expect(get(obj, 'x.2.y')).toBe('array-value');
  });

  it("should return undefined for non-existent path without default", () => {
    expect(get(obj, 'non.existent.path')).toBeUndefined();
  });

  it("should handle null/undefined objects", () => {
    expect(get(null, 'a.b', 'default')).toBe('default');
    expect(get(undefined, 'a.b', 'default')).toBe('default');
  });
});
