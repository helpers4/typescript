/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { tween } from './tween';

function clock() {
  let time = 1000;
  return { now: () => time, advance: (ms: number) => { time += ms; } };
}

describe('tween', () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

  it('updates with from at once, then each frame, and ends exactly on to', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('requestAnimationFrame', undefined);
    const c = clock();
    const onUpdate = vi.fn();
    const { finished } = tween({ from: { x: 0 }, to: { x: 100 }, durationMs: 100, onUpdate, now: c.now });
    expect(onUpdate).toHaveBeenLastCalledWith({ x: 0 }, 0);
    c.advance(40);
    vi.advanceTimersByTime(16);
    expect(onUpdate).toHaveBeenLastCalledWith({ x: 40 }, 0.4);
    c.advance(100);
    vi.advanceTimersByTime(16);
    expect(onUpdate).toHaveBeenLastCalledWith({ x: 100 }, 1);
    await expect(finished).resolves.toBe(true);
    const calls = onUpdate.mock.calls.length;
    vi.advanceTimersByTime(100);
    expect(onUpdate).toHaveBeenCalledTimes(calls);
  });

  it('applies the easing, but always ends on to', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('requestAnimationFrame', undefined);
    const c = clock();
    const values: number[] = [];
    const { finished } = tween({ from: 0, to: 10, durationMs: 100, easing: (t) => t * t, onUpdate: (v) => values.push(v), now: c.now });
    c.advance(50);
    vi.advanceTimersByTime(16);
    c.advance(50);
    vi.advanceTimersByTime(16);
    await finished;
    expect(values).toEqual([0, 2.5, 10]);
  });

  it('uses the default clock and linear easing', async () => {
    const values: number[] = [];
    await tween({ from: 0, to: 1, durationMs: 20, onUpdate: (v) => values.push(v) }).finished;
    expect(values.at(0)).toBe(0);
    expect(values.at(-1)).toBe(1);
  });

  it('cancel stops updates and resolves finished with false', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('requestAnimationFrame', undefined);
    const onUpdate = vi.fn();
    const t = tween({ from: 0, to: 1, durationMs: 100, onUpdate, now: clock().now });
    t.cancel();
    t.cancel();
    vi.advanceTimersByTime(200);
    expect(onUpdate).toHaveBeenCalledTimes(1);
    await expect(t.finished).resolves.toBe(false);
  });

  it('cancel after the end changes nothing', async () => {
    const onUpdate = vi.fn();
    const t = tween({ from: 0, to: 1, durationMs: 0, onUpdate });
    t.cancel();
    await expect(t.finished).resolves.toBe(true);
  });

  it('jumps to the end at once for a zero or negative duration', async () => {
    const onUpdate = vi.fn();
    await expect(tween({ from: 0, to: 5, durationMs: -1, onUpdate }).finished).resolves.toBe(true);
    expect(onUpdate.mock.calls).toEqual([[5, 1]]);
  });

  it('uses requestAnimationFrame when available', async () => {
    const frames: (() => void)[] = [];
    const cancelAnimationFrame = vi.fn();
    vi.stubGlobal('requestAnimationFrame', (callback: () => void) => frames.push(callback));
    vi.stubGlobal('cancelAnimationFrame', cancelAnimationFrame);
    const c = clock();
    const onUpdate = vi.fn();
    const running = tween({ from: 0, to: 1, durationMs: 10, onUpdate, now: c.now });
    expect(frames).toHaveLength(1);
    frames.shift()!();
    expect(frames).toHaveLength(1);
    running.cancel();
    expect(cancelAnimationFrame).toHaveBeenCalledOnce();
    const done = tween({ from: 0, to: 1, durationMs: 10, onUpdate, now: c.now });
    c.advance(10);
    frames.at(-1)!();
    await expect(done.finished).resolves.toBe(true);
  });

  it('blends any value with a custom interpolate', async () => {
    const values: string[] = [];
    await tween({
      from: 'a',
      to: 'b',
      durationMs: 0,
      interpolate: (from: string, to: string, t: number) => (t < 1 ? from : to),
      onUpdate: (value) => values.push(value),
    }).finished;
    expect(values).toEqual(['b']);
  });

  it('rejects a NaN duration', () => {
    expect(() => tween({ from: 0, to: 1, durationMs: Number.NaN, onUpdate: () => {} })).toThrow(RangeError);
  });
});
