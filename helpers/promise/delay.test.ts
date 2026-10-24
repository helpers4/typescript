/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it, vi } from "vitest";
import { delay } from "./delay";

describe("delay", () => {
  it("should resolve after specified time", async () => {
    const start = Date.now();
    await delay(100);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeGreaterThanOrEqual(90);
    expect(elapsed).toBeLessThan(200);
  });

  it("should resolve with specified value", async () => {
    const result = await delay(50, "test-value");
    expect(result).toBe("test-value");
  });

  it("should work with numbers", async () => {
    const result = await delay(50, 42);
    expect(result).toBe(42);
  });

  it("should work without value", async () => {
    const result = await delay(50);
    expect(result).toBeUndefined();
  });

  describe("with a signal", () => {
    it("rejects at once with the reason of an already aborted signal, without a timer", async () => {
      vi.useFakeTimers();
      try {
        const promise = delay(100, "value", { signal: AbortSignal.abort("gone") });
        expect(vi.getTimerCount()).toBe(0);
        await expect(promise).rejects.toBe("gone");
      } finally {
        vi.useRealTimers();
      }
    });

    it("clears the timer and rejects with the reason when aborted", async () => {
      vi.useFakeTimers();
      try {
        const controller = new AbortController();
        const promise = delay(100, "value", { signal: controller.signal });
        expect(vi.getTimerCount()).toBe(1);
        controller.abort("stop");
        expect(vi.getTimerCount()).toBe(0);
        await expect(promise).rejects.toBe("stop");
      } finally {
        vi.useRealTimers();
      }
    });

    it("resolves and lets go of the signal when not aborted", async () => {
      const controller = new AbortController();
      const remove = vi.spyOn(controller.signal, "removeEventListener");
      expect(await delay(10, "value", { signal: controller.signal })).toBe("value");
      expect(remove).toHaveBeenCalledOnce();
      controller.abort();
    });
  });
});
