/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { delay } from './delay';

describe('delay — contract', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('resolves after the specified milliseconds', async () => {
    let resolved = false;
    const p = delay(100).then(() => { resolved = true; });

    expect(resolved).toBe(false);

    await vi.advanceTimersByTimeAsync(100);
    await p;

    expect(resolved).toBe(true);
  });

  it('delay(0, "hello") resolves with "hello"', async () => {
    const p = delay(0, 'hello');
    await vi.advanceTimersByTimeAsync(0);
    expect(await p).toBe('hello');
  });

  it('delay(500, 42) resolves with 42 after 500ms', async () => {
    let result: number | undefined;
    const p = delay(500, 42).then(v => { result = v; });

    await vi.advanceTimersByTimeAsync(499);
    expect(result).toBeUndefined();

    await vi.advanceTimersByTimeAsync(1);
    await p;
    expect(result).toBe(42);
  });

  it('delay(0) resolves with undefined', async () => {
    const p = delay(0);
    await vi.advanceTimersByTimeAsync(0);
    expect(await p).toBeUndefined();
  });
});
