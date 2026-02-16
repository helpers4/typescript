/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

/*
 * This program is under the terms of the GNU Affero General Public License version 3
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { expect, test, describe } from "vitest";
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
});