/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { capitalize } from "./capitalize";

describe("capitalize", () => {
  it("should capitalize first letter", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  it("should lowercase other letters", () => {
    expect(capitalize("hELLO")).toBe("Hello");
  });

  it("should handle empty string", () => {
    expect(capitalize("")).toBe("");
  });

  it("should handle single character", () => {
    expect(capitalize("a")).toBe("A");
  });

  it("should handle already capitalized", () => {
    expect(capitalize("Hello")).toBe("Hello");
  });

  it('should return null when given null', () => {
    expect(capitalize(null)).toBeNull();
  });

  it('should return undefined when given undefined', () => {
    expect(capitalize(undefined)).toBeUndefined();
  });

  // --- Mutation-killing tests ---

  // L13: ConditionalExpression -> false (str.charAt(0).toUpperCase() + str.slice(1).toLowerCase())
  // If the expression is replaced with false, capitalize would return false instead of string
  it('should return a string, not false', () => {
    const result = capitalize('test');
    expect(result).toBe('Test');
    expect(typeof result).toBe('string');
    expect(result).not.toBe(false);
  });

  it('should capitalize and lowercase correctly', () => {
    expect(capitalize('tEST')).toBe('Test');
    expect(capitalize('TEST')).toBe('Test');
    expect(capitalize('test')).toBe('Test');
  });

  describe('lowercaseRest: false', () => {
    it('uppercases first char without lowercasing the rest', () => {
      expect(capitalize('hELLO', { lowercaseRest: false })).toBe('HELLO');
    });

    it('does not change rest that is already lowercase', () => {
      expect(capitalize('hello', { lowercaseRest: false })).toBe('Hello');
    });

    it('handles null and undefined with option', () => {
      expect(capitalize(null, { lowercaseRest: false })).toBeNull();
      expect(capitalize(undefined, { lowercaseRest: false })).toBeUndefined();
    });
  });
});
