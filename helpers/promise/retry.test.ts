/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { retry } from "./retry";

describe("retry", () => {
  it("should return result on first success", async () => {
    const fn = () => Promise.resolve("success");
    const result = await retry(fn, 3, 10);

    expect(result).toBe("success");
  });

  it("should retry on failure", async () => {
    let attempts = 0;
    const fn = () => {
      attempts++;
      if (attempts < 3) {
        return Promise.reject(new Error("fail"));
      }
      return Promise.resolve("success");
    };

    const result = await retry(fn, 3, 10);
    expect(result).toBe("success");
    expect(attempts).toBe(3);
  });

  it("should throw last error after max attempts", async () => {
    let attempts = 0;
    const fn = () => {
      attempts++;
      return Promise.reject(new Error(`fail ${attempts}`));
    };

    try {
      await retry(fn, 2, 10);
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      expect((error as Error).message).toBe("fail 2");
      expect(attempts).toBe(2);
    }
  });

  // --- Mutation-killing tests ---

  // L27: ConditionalExpression -> false (break never executes)
  // If false, the loop would continue past maxAttempts and try again
  it("should stop retrying after maxAttempts", async () => {
    let attempts = 0;
    const fn = () => {
      attempts++;
      return Promise.reject(new Error('fail'));
    };

    await expect(retry(fn, 3, 1)).rejects.toThrow('fail');
    expect(attempts).toBe(3); // Exactly 3, not more
  });

  // L27: BlockStatement -> {} (break removed, delay still happens)
  // Similar to above but the break is specifically what stops the loop
  it("should not attempt more than maxAttempts times", async () => {
    let attempts = 0;
    const fn = () => {
      attempts++;
      return Promise.reject(new Error(`attempt ${attempts}`));
    };

    try {
      await retry(fn, 1, 1);
    } catch (error) {
      expect((error as Error).message).toBe('attempt 1');
    }
    expect(attempts).toBe(1); // Exactly 1 attempt with maxAttempts=1
  });
});
