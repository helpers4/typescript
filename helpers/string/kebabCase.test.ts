/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { kebabCase } from "./kebabCase";

describe("kebabCase", () => {
  it("should convert camelCase to kebab-case", () => {
    expect(kebabCase("camelCase")).toBe("camel-case");
  });

  it("should convert PascalCase to kebab-case", () => {
    expect(kebabCase("PascalCase")).toBe("pascal-case");
  });

  it("should handle multiple uppercase letters", () => {
    expect(kebabCase("XMLHttpRequest")).toBe("xml-http-request");
  });

  it("should handle already kebab-case", () => {
    expect(kebabCase("already-kebab")).toBe("already-kebab");
  });

  it("should handle empty string", () => {
    expect(kebabCase("")).toBe("");
  });

  it("should handle single word", () => {
    expect(kebabCase("hello")).toBe("hello");
    expect(kebabCase("Hello")).toBe("hello");
  });
});
