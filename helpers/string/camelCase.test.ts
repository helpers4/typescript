/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
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
    expect(camelCase("-leading")).toBe("leading");
  });

  it("should convert snake_case to camelCase", () => {
    expect(camelCase("user_name")).toBe("userName");
  });

  it("should convert PascalCase to camelCase", () => {
    expect(camelCase("UserName")).toBe("userName");
  });

  it("should convert space-separated words to camelCase", () => {
    expect(camelCase("user name")).toBe("userName");
  });

  it("should handle mixed separators", () => {
    expect(camelCase("user_name-here too")).toBe("userNameHereToo");
  });

  it("should treat an embedded acronym as a word boundary, lowercasing all but its last letter", () => {
    expect(camelCase("userID")).toBe("userId");
    expect(camelCase("parseHTMLString")).toBe("parseHtmlString");
    expect(camelCase("apiURL")).toBe("apiUrl");
  });

  it('should return null when given null', () => {
    expect(camelCase(null)).toBeNull();
  });

  it('should return undefined when given undefined', () => {
    expect(camelCase(undefined)).toBeUndefined();
  });

  describe('security edge cases', () => {
    it('should handle XSS payload in input without throwing', () => {
      const result = camelCase('<script>alert(1)</script>');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle HTML injection payload', () => {
      const result = camelCase('<img onerror="alert(1)" src=x>');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle extremely long input without hanging', () => {
      const long = 'a-'.repeat(10000) + 'b';
      const result = camelCase(long);
      expect(result).toBeDefined();
    });

    it('should handle null bytes in input', () => {
      const result = camelCase('hello\0world');
      expect(result).toBeDefined();
    });

    it('should handle unicode injection', () => {
      const result = camelCase('hello\u200Bworld');
      expect(result).toBeDefined();
    });
  });
});
