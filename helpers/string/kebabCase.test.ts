/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
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

  it("should convert snake_case to kebab-case", () => {
    expect(kebabCase("user_name")).toBe("user-name");
  });

  it("should convert space-separated words to kebab-case", () => {
    expect(kebabCase("user name")).toBe("user-name");
  });

  it("should handle mixed separators", () => {
    expect(kebabCase("user_name here")).toBe("user-name-here");
  });

  it("should not produce leading/trailing hyphens for leading/trailing separators", () => {
    expect(kebabCase("  leading spaces")).toBe("leading-spaces");
    expect(kebabCase("trailing  ")).toBe("trailing");
    expect(kebabCase("_id")).toBe("id");
  });

  it("should not produce a double hyphen for adjacent separators", () => {
    expect(kebabCase("foo_-bar")).toBe("foo-bar");
  });

  it('should return null when given null', () => {
    expect(kebabCase(null)).toBeNull();
  });

  it('should return undefined when given undefined', () => {
    expect(kebabCase(undefined)).toBeUndefined();
  });

  describe('security edge cases', () => {
    it('should handle XSS payload in input', () => {
      const result = kebabCase('<script>alert(1)</script>');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle HTML injection payload', () => {
      const result = kebabCase('<img onerror="alert(1)" src=x>');
      expect(result).toBeDefined();
    });

    it('should handle extremely long input without hanging', () => {
      const long = 'camelCase'.repeat(5000);
      const result = kebabCase(long);
      expect(result).toBeDefined();
    });

    it('should handle null bytes in input', () => {
      const result = kebabCase('hello\0world');
      expect(result).toBeDefined();
    });
  });
});
