/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { camelCase } from "./camelCase";

describe("camelCase", () => {
  it("should convert kebab-case to camelCase", () => {
    expect(camelCase("kebab-case")).toBe("kebabCase");
  });

  it("should handle multiple dashes", () => {
    expect(camelCase("multi-word-string")).toBe("multiWordString");
  });

  it("should handle already camelCase", () => {
    expect(camelCase("alreadyCamel")).toBe("alreadyCamel");
  });

  it("should handle empty string", () => {
    expect(camelCase("")).toBe("");
  });

  it("should handle single word", () => {
    expect(camelCase("hello")).toBe("hello");
  });

  it("should handle leading dash", () => {
    expect(camelCase("-leading")).toBe("Leading");
  });
});
