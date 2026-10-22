/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it, vi } from 'vitest';
import { once } from './once';

describe('once', () => {
  it('calls the function only on the first invocation', () => {
    const fn = vi.fn((x: number) => x * 2);
    const wrapped = once(fn);

    wrapped(3);
    wrapped(3);
    wrapped(3);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('returns the same result on every call', () => {
    const wrapped = once((x: number) => x * 2);

    expect(wrapped(5)).toBe(10);
    expect(wrapped(99)).toBe(10); // args ignored after first call
    expect(wrapped(0)).toBe(10);
  });

  it('passes arguments to the first call', () => {
    const fn = vi.fn((a: string, b: string) => `${a}-${b}`);
    const wrapped = once(fn);

    expect(wrapped('hello', 'world')).toBe('hello-world');
    expect(fn).toHaveBeenCalledWith('hello', 'world');
  });

  it('caches undefined return value', () => {
    let count = 0;
    const wrapped = once(() => { count++; return undefined; });

    wrapped();
    wrapped();
    wrapped();

    expect(count).toBe(1);
  });

  it('caches falsy return value (0)', () => {
    const fn = vi.fn(() => 0);
    const wrapped = once(fn);

    expect(wrapped()).toBe(0);
    expect(wrapped()).toBe(0);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('works with no-argument functions', () => {
    let count = 0;
    const wrapped = once(() => ++count);

    expect(wrapped()).toBe(1);
    expect(wrapped()).toBe(1);
    expect(count).toBe(1);
  });

  it('re-throws if the first call throws, and retries on the next call', () => {
    let calls = 0;
    const wrapped = once(() => {
      calls++;
      if (calls === 1) throw new Error('boom');
      return 'ok';
    });

    expect(() => wrapped()).toThrow('boom');
    expect(calls).toBe(1);
    // called must still be false — the throw did not lock the cache
    expect(wrapped()).toBe('ok');
    expect(calls).toBe(2);
    // now locked
    expect(wrapped()).toBe('ok');
    expect(calls).toBe(2);
  });

  describe('reset()', () => {
    it('allows the function to be called again after reset', () => {
      let count = 0;
      const wrapped = once(() => ++count);

      expect(wrapped()).toBe(1);
      expect(wrapped()).toBe(1);

      wrapped.reset();

      expect(wrapped()).toBe(2);
      expect(wrapped()).toBe(2);
      expect(count).toBe(2);
    });

    it('multiple resets work correctly', () => {
      const fn = vi.fn((x: number) => x * 2);
      const wrapped = once(fn);

      wrapped(1);
      wrapped.reset();
      wrapped(2);
      wrapped.reset();
      wrapped(3);

      expect(fn).toHaveBeenCalledTimes(3);
      expect(fn).toHaveBeenNthCalledWith(1, 1);
      expect(fn).toHaveBeenNthCalledWith(2, 2);
      expect(fn).toHaveBeenNthCalledWith(3, 3);
    });
  });
});
