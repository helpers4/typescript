/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import {
  isSet,
  isString,
  isNumber,
  isBoolean,
  isArray,
  isObject,
  isFunction,
  isDate,
  isValidRegex
} from "./typeChecks";

describe("type checking functions", () => {
  describe("isSet", () => {
    it("should return true for valid values", () => {
      expect(isSet("hello")).toBe(true);
      expect(isSet(0)).toBe(true);
      expect(isSet(false)).toBe(true);
      expect(isSet([])).toBe(true);
      expect(isSet({})).toBe(true);
    });

    it("should return false for null and undefined", () => {
      expect(isSet(null)).toBe(false);
      expect(isSet(undefined)).toBe(false);
    });
  });

  describe("basic type checks", () => {
    it("should check strings", () => {
      expect(isString("hello")).toBe(true);
      expect(isString(123)).toBe(false);
    });

    it("should check numbers", () => {
      expect(isNumber(123)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber("123")).toBe(false);
    });

    it("should check booleans", () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
      expect(isBoolean(1)).toBe(false);
    });

    it("should check arrays", () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray({})).toBe(false);
    });

    it("should check objects", () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
      expect(isObject([])).toBe(false);
      expect(isObject(null)).toBe(false);
    });

    it("should check functions", () => {
      expect(isFunction(() => { })).toBe(true);
      expect(isFunction(function () { })).toBe(true);
      expect(isFunction("function")).toBe(false);
    });

    it("should check dates", () => {
      expect(isDate(new Date())).toBe(true);
      expect(isDate(new Date("invalid"))).toBe(false);
      expect(isDate("2023-01-01")).toBe(false);
    });
  });

  describe("isValidRegex", () => {
    it("should validate correct regex patterns", () => {
      expect(isValidRegex("[a-z]+")).toBe(true);
      expect(isValidRegex("\\d{3}")).toBe(true);
      expect(isValidRegex(".*")).toBe(true);
    });

    it("should reject invalid regex patterns", () => {
      expect(isValidRegex("[")).toBe(false);
      expect(isValidRegex("*")).toBe(false);
      expect(isValidRegex("(?")).toBe(false);
    });
  });
});
