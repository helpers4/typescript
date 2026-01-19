/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { isTimestampInSeconds, normalizeTimestamp } from "./timestamp";

describe("timestamp utilities", () => {
  describe("isTimestampInSeconds", () => {
    it("should identify seconds vs milliseconds", () => {
      expect(isTimestampInSeconds(1642694400)).toBe(true); // 2022-01-20 in seconds
      expect(isTimestampInSeconds(1642694400000)).toBe(false); // 2022-01-20 in milliseconds
    });
  });

  describe("normalizeTimestamp", () => {
    it("should normalize timestamps", () => {
      expect(normalizeTimestamp(1642694400)).toBe(1642694400000);
      expect(normalizeTimestamp(1642694400000)).toBe(1642694400000);
    });
  });
});
