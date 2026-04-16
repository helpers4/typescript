/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/*
 * This program is under the terms of the GNU Lesser General Public License version 3
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { describe, expect, test } from "vitest";
import { errorToReadableMessage } from "./errorToReadableMessage";

describe('errorToReadableMessage', () => {
  // Basic cases
  test("should return undefined when error is null", () =>
    expect(errorToReadableMessage(null)).toBeUndefined());

  test("should return undefined when error is undefined", () =>
    expect(errorToReadableMessage(undefined)).toBeUndefined());

  test("should return error when type is string", () =>
    expect(errorToReadableMessage("unexpected error")).toBe("unexpected error"));

  test("should return string for number error", () =>
    expect(errorToReadableMessage(123)).toBe("123"));

  test("should return string for boolean error", () =>
    expect(errorToReadableMessage(true)).toBe("true"));

  // Nested error - errorMessage
  test("should return errorMessage when present in nested error", () =>
    expect(errorToReadableMessage({ error: { errorMessage: "keycloak error" } })).toBe(
      "keycloak error"
    ));

  // Nested error - direct string
  test("should return error when present in error as string", () =>
    expect(errorToReadableMessage({ error: "direct error" })).toBe(
      "direct error"
    ));

  // Nested error - deep nesting
  test("should handle deeply nested errors", () =>
    expect(errorToReadableMessage({ error: { error: { error: "deep error" } } })).toBe(
      "deep error"
    ));

  // Message field
  test("should return message when present in error", () =>
    expect(errorToReadableMessage({ message: "error message" })).toBe(
      "error message"
    ));

  // Error instance
  test("should return message from Error instance", () => {
    const err = new Error("error instance message");
    expect(errorToReadableMessage(err)).toBe("Error: error instance message");
  });

  // TypeError instance
  test("should return message from TypeError instance", () => {
    const err = new TypeError("type error message");
    expect(errorToReadableMessage(err)).toBe("TypeError: type error message");
  });

  // OAuth errors - code_error
  test("should handle OAuth code_error with reason and params", () => {
    const oauthError = {
      type: "code_error",
      reason: "auth_failed",
      params: {
        error: "invalid_grant",
        error_description: "Invalid credentials"
      }
    };
    expect(errorToReadableMessage(oauthError)).toBe(
      "invalid_grant: Invalid credentials"
    );
  });

  // OAuth errors - other type
  test("should handle OAuth errors with other type", () => {
    const oauthError = {
      type: "auth_error",
      reason: "session_expired",
      params: {
        error: "invalid_session",
        error_description: "Session expired"
      }
    };
    expect(errorToReadableMessage(oauthError)).toBe(
      "auth_error: session_expired"
    );
  });

  // Stringify parameter - true
  test("should stringify error when stringify is true", () =>
    expect(errorToReadableMessage({ customError: "value" }, true)).toBe(
      '{"customError":"value"}'
    ));

  // Stringify parameter - false (default)
  test("should return undefined with unknown error object and stringify false", () =>
    expect(errorToReadableMessage({ customError: "value" }, false)).toBeUndefined());

  // Stringify parameter - custom string
  test("should return custom fallback when provided", () =>
    expect(errorToReadableMessage({ unknownError: true }, "default message")).toBe(
      "default message"
    ));

  // Complex custom object with custom stringify
  test("should stringify complex object with custom message", () => {
    const result = errorToReadableMessage(
      { code: 500, details: { nested: true } },
      true
    );
    expect(result).toContain('"code":500');
    expect(result).toContain('"nested":true');
  });

  // --- Mutation-killing tests ---

  // L54: typeof error === "string" -> false / BlockStatement {} / StringLiteral ""
  // If mutated, string errors would NOT be returned directly, they'd fall through to isPlainObject
  test("should return string error directly without modification", () => {
    const msg = "plain string error";
    const result = errorToReadableMessage(msg);
    // Must be the exact same string, not String(msg) or something else
    expect(result).toBe(msg);
    expect(typeof result).toBe("string");
  });

  test("should return string error and NOT treat it as object", () => {
    // If string check is skipped, this would fall through to isPlainObject check
    // and then controlReturn(String(error)) — which happens to be the same string
    // But we need to verify it returns the EXACT input string
    const str = "test error";
    expect(errorToReadableMessage(str)).toBe(str);
    // Verify it's not going through String() conversion (same for strings, but matters for type)
    expect(errorToReadableMessage("")).toBeUndefined();
  });

  // L76: "reason" in errObj && "params" in errObj -> ||
  // If ||, object with only "reason" (no "params") would enter OAuth path
  test("should NOT enter OAuth path when only reason is present (no params)", () => {
    const obj = { reason: "some reason" };
    // With ||, this would enter OAuth path and try to access type/reason
    // Without "params", it should fall through to "message" check or controlReturn
    expect(errorToReadableMessage(obj)).toBeUndefined();
  });

  test("should NOT enter OAuth path when only params is present (no reason)", () => {
    const obj = { params: { error: "err", error_description: "desc" } };
    // With ||, this would enter OAuth path
    // Without "reason", it should fall through
    expect(errorToReadableMessage(obj)).toBeUndefined();
  });

  // L82: ConditionalExpression -> true (always enters code_error branch)
  // Need test where reason+params exist but type is NOT "code_error"
  test("should use type:reason format when type is not code_error", () => {
    const obj = {
      type: "other_type",
      reason: "some_reason",
      params: {
        error: "should_not_use",
        error_description: "should not appear"
      }
    };
    // With ConditionalExpression true, would always enter the code_error branch
    // and return "should_not_use: should not appear"
    expect(errorToReadableMessage(obj)).toBe("other_type: some_reason");
  });

  test("should use type:reason format when params is missing error fields", () => {
    const obj = {
      type: "code_error",
      reason: "auth_failed",
      params: {} // No error or error_description
    };
    // Even though type is code_error, params lacks required fields
    expect(errorToReadableMessage(obj)).toBe("code_error: auth_failed");
  });
});
