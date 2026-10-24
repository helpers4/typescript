/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { frameLoop } from './frameLoop';
import type { FrameLoop } from './frameLoop';

describe('frameLoop', () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

  it('calls onFrame at once with 0, then with the elapsed time, until it returns false', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('requestAnimationFrame', undefined);
    let time = 500;
    const seen: number[] = [];
    const loop = frameLoop((elapsed) => {
      seen.push(elapsed);
      return elapsed < 30;
    }, { now: () => time });
    expect(seen).toEqual([0]);
    time += 20;
    vi.advanceTimersByTime(16);
    time += 20;
    vi.advanceTimersByTime(16);
    await expect(loop.finished).resolves.toBe(true);
    vi.advanceTimersByTime(100);
    expect(seen).toEqual([0, 20, 40]);
  });

  it('keeps going while onFrame returns undefined or true', () => {
    vi.useFakeTimers();
    vi.stubGlobal('requestAnimationFrame', undefined);
    const onFrame = vi.fn();
    const loop = frameLoop(onFrame);
    vi.advanceTimersByTime(16 * 5);
    expect(onFrame).toHaveBeenCalledTimes(6);
    loop.cancel();
  });

  it('cancel stops it and resolves finished with false; later cancels do nothing', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('requestAnimationFrame', undefined);
    const onFrame = vi.fn();
    const loop = frameLoop(onFrame);
    loop.cancel();
    loop.cancel();
    vi.advanceTimersByTime(100);
    expect(onFrame).toHaveBeenCalledOnce();
    await expect(loop.finished).resolves.toBe(false);
  });

  it('can be cancelled from inside onFrame', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('requestAnimationFrame', undefined);
    let calls = 0;
    const loop: FrameLoop = frameLoop(() => {
      calls++;
      if (calls === 2) loop.cancel();
    });
    vi.advanceTimersByTime(100);
    expect(calls).toBe(2);
    await expect(loop.finished).resolves.toBe(false);
  });

  it('cancel after the end changes nothing', async () => {
    const loop = frameLoop(() => false);
    loop.cancel();
    await expect(loop.finished).resolves.toBe(true);
  });

  it('uses requestAnimationFrame when available', () => {
    const frames: (() => void)[] = [];
    const cancelAnimationFrame = vi.fn();
    vi.stubGlobal('requestAnimationFrame', (callback: () => void) => frames.push(callback));
    vi.stubGlobal('cancelAnimationFrame', cancelAnimationFrame);
    const onFrame = vi.fn();
    const loop = frameLoop(onFrame);
    frames.shift()!();
    expect(onFrame).toHaveBeenCalledTimes(2);
    loop.cancel();
    expect(cancelAnimationFrame).toHaveBeenCalledOnce();
  });

  describe('with a signal', () => {
    it('never calls onFrame with an already aborted signal', async () => {
      vi.useFakeTimers();
      vi.stubGlobal('requestAnimationFrame', undefined);
      const onFrame = vi.fn();
      const loop = frameLoop(onFrame, { signal: AbortSignal.abort() });
      expect(onFrame).not.toHaveBeenCalled();
      expect(vi.getTimerCount()).toBe(0);
      expect(() => loop.cancel()).not.toThrow();
      await expect(loop.finished).resolves.toBe(false);
    });

    it('cancels the loop when the signal aborts', async () => {
      vi.useFakeTimers();
      vi.stubGlobal('requestAnimationFrame', undefined);
      const controller = new AbortController();
      const onFrame = vi.fn();
      const loop = frameLoop(onFrame, { signal: controller.signal });
      controller.abort();
      expect(vi.getTimerCount()).toBe(0);
      vi.advanceTimersByTime(100);
      expect(onFrame).toHaveBeenCalledOnce();
      await expect(loop.finished).resolves.toBe(false);
    });

    it('lets go of the signal when the loop ends or is cancelled', () => {
      vi.useFakeTimers();
      vi.stubGlobal('requestAnimationFrame', undefined);
      const controller = new AbortController();
      const remove = vi.spyOn(controller.signal, 'removeEventListener');
      let frames = 0;
      frameLoop(() => ++frames < 2, { signal: controller.signal });
      vi.advanceTimersByTime(16);
      expect(remove).toHaveBeenCalledOnce();
      frameLoop(() => {}, { signal: controller.signal }).cancel();
      expect(remove).toHaveBeenCalledTimes(2);
      frameLoop(() => false, { signal: controller.signal });
      expect(remove).toHaveBeenCalledTimes(2);
    });
  });
});
