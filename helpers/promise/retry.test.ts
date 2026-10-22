/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it, vi } from "vitest";
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

  describe("with options", () => {
    it("should use the defaults when options is empty", async () => {
      let attempts = 0;
      const result = await retry(() => {
        attempts++;
        return Promise.resolve("ok");
      }, {});
      expect(result).toBe("ok");
      expect(attempts).toBe(1);
    });

    it("should honor attempts", async () => {
      let attempts = 0;
      const fn = () => {
        attempts++;
        return Promise.reject(new Error(`fail ${attempts}`));
      };

      await expect(retry(fn, { attempts: 4, delayMs: 0 })).rejects.toThrow("fail 4");
      expect(attempts).toBe(4);
    });

    it("should rethrow at once when shouldRetry returns false", async () => {
      let attempts = 0;
      const fn = () => {
        attempts++;
        return Promise.reject(new Error("fatal"));
      };

      await expect(retry(fn, { attempts: 5, delayMs: 0, shouldRetry: () => false })).rejects.toThrow("fatal");
      expect(attempts).toBe(1);
    });

    it("should pass the error and the attempt number to shouldRetry", async () => {
      const calls: [string, number][] = [];
      let attempts = 0;
      const fn = () => {
        attempts++;
        return Promise.reject(new Error(attempts < 3 ? "transient" : "fatal"));
      };

      await expect(
        retry(fn, {
          attempts: 5,
          delayMs: 0,
          shouldRetry: (error, attempt) => {
            calls.push([(error as Error).message, attempt]);
            return (error as Error).message === "transient";
          },
        }),
      ).rejects.toThrow("fatal");
      expect(calls).toEqual([["transient", 1], ["transient", 2], ["fatal", 3]]);
      expect(attempts).toBe(3);
    });

    it("should not call shouldRetry after the last attempt", async () => {
      let calls = 0;
      await expect(
        retry(() => Promise.reject(new Error("fail")), {
          attempts: 2,
          delayMs: 0,
          shouldRetry: () => {
            calls++;
            return true;
          },
        }),
      ).rejects.toThrow("fail");
      expect(calls).toBe(1);
    });

    it("should compute the delay from the attempt number and the error", async () => {
      const delays: [number, string][] = [];
      let attempts = 0;
      const result = await retry(
        () => {
          attempts++;
          return attempts < 4 ? Promise.reject(new Error(`fail ${attempts}`)) : Promise.resolve("done");
        },
        {
          attempts: 5,
          delayMs: (attempt, error) => {
            delays.push([attempt, (error as Error).message]);
            return 0;
          },
        },
      );
      expect(result).toBe("done");
      expect(delays).toEqual([[1, "fail 1"], [2, "fail 2"], [3, "fail 3"]]);
    });

    it("should wait the computed delay between attempts", async () => {
      vi.useFakeTimers();
      try {
        let attempts = 0;
        const p = retry(
          () => {
            attempts++;
            return Promise.reject(new Error("fail"));
          },
          { attempts: 3, delayMs: (attempt) => 100 * 2 ** (attempt - 1) },
        ).catch((e: unknown) => e);

        await vi.advanceTimersByTimeAsync(0);
        expect(attempts).toBe(1);
        await vi.advanceTimersByTimeAsync(99);
        expect(attempts).toBe(1);
        await vi.advanceTimersByTimeAsync(1);
        expect(attempts).toBe(2);
        await vi.advanceTimersByTimeAsync(199);
        expect(attempts).toBe(2);
        await vi.advanceTimersByTimeAsync(1);
        expect(attempts).toBe(3);
        expect(await p).toBeInstanceOf(Error);
      } finally {
        vi.useRealTimers();
      }
    });

    it("should run fn once when attempts is below 1", async () => {
      let attempts = 0;
      await expect(
        retry(() => {
          attempts++;
          return Promise.reject(new Error("fail"));
        }, { attempts: 0 }),
      ).rejects.toThrow("fail");
      expect(attempts).toBe(1);
    });
  });

  it("should wait the fixed delay between attempts", async () => {
    vi.useFakeTimers();
    try {
      let attempts = 0;
      const p = retry(() => {
        attempts++;
        return Promise.reject(new Error("fail"));
      }, 2, 50).catch((e: unknown) => e);

      await vi.advanceTimersByTimeAsync(49);
      expect(attempts).toBe(1);
      await vi.advanceTimersByTimeAsync(1);
      expect(attempts).toBe(2);
      expect(await p).toBeInstanceOf(Error);
    } finally {
      vi.useRealTimers();
    }
  });

  it("should default to 3 attempts", async () => {
    vi.useFakeTimers();
    try {
      let attempts = 0;
      const p = retry(() => {
        attempts++;
        return Promise.reject(new Error("fail"));
      }).catch((e: unknown) => e);
      await vi.runAllTimersAsync();
      expect(await p).toBeInstanceOf(Error);
      expect(attempts).toBe(3);
    } finally {
      vi.useRealTimers();
    }
  });

  it("should pass the 1-based attempt number to fn", async () => {
    const seen: number[] = [];
    const result = await retry((attempt) => {
      seen.push(attempt);
      return attempt < 3 ? Promise.reject(new Error("fail")) : Promise.resolve("ok");
    }, { attempts: 3, delayMs: 0 });
    expect(result).toBe("ok");
    expect(seen).toEqual([1, 2, 3]);
  });
});
