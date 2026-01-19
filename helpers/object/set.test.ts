/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { set } from "./set";

describe("set", () => {
  it("should set nested value using dot notation", () => {
    const obj = {};
    set(obj, 'a.b.c', 'value');

    expect(obj).toEqual({
      a: {
        b: {
          c: 'value'
        }
      }
    });
  });

  it("should set value in existing object", () => {
    const obj: Record<string, any> = { a: { x: 1 } };
    set(obj, 'a.b', 'new-value');

    expect(obj).toEqual({
      a: {
        x: 1,
        b: 'new-value'
      }
    });
  });

  it("should overwrite existing values", () => {
    const obj = { a: { b: 'old' } };
    set(obj, 'a.b', 'new');

    expect(obj.a.b).toBe('new');
  });

  it("should return the modified object", () => {
    const obj = {};
    const result = set(obj, 'a.b', 'value');

    expect(result).toBe(obj);
  });
});
