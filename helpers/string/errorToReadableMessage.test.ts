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
  test("should return error when type of string", async () =>
    expect(errorToReadableMessage("unexpected error")).toBe("unexpected error"));

  test("should return errorMessage when present in error", async () =>
    expect(errorToReadableMessage({ error: { errorMessage: "unexpected error" } })).toBe(
      "unexpected error"
    ));

  test("should return error when present in error", async () =>
    expect(errorToReadableMessage({ error: "unexpected error" })).toBe(
      "unexpected error"
    ));

  test("should return message when present in error", async () =>
    expect(errorToReadableMessage({ message: "unexpected error" })).toBe(
      "unexpected error"
    ));

  test("should return stringified error in all other cases", async () =>
    expect(errorToReadableMessage({ customError: "unexpected error" }, true)).toBe(
      '{"customError":"unexpected error"}'
    ));
});


/*
old code

export function errorToString(error: any): string {
  if (!error) {
    return "Un unexpected error occurred";
  } else if (typeof error === "string") {
    return error;
  } else if (error?.error?.errorMessage) {
    // Keycloak specific error
    return error.error.errorMessage;
  } else if ("error" in error) {
    return errorToString(error.error);
  } else if (error instanceof Error || "message" in error) {
    return error.message;
  } else {
    return JSON.stringify(error);
  }
}
  
*/