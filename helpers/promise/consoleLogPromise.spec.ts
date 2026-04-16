/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it, vi } from 'vitest';
import { consoleLogPromise } from './consoleLogPromise';

describe('consoleLogPromise — property-based', () => {
  it('returned function is identity for any value', () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined);

    fc.assert(
      fc.property(fc.anything(), (value: unknown) => {
        const fn = consoleLogPromise<unknown>();
        expect(fn(value)).toBe(value);
      }),
    );

    vi.restoreAllMocks();
  });

  it('never throws for any input', () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined);

    fc.assert(
      fc.property(fc.string(), fc.anything(), (prefix: string, value: unknown) => {
        const fn = consoleLogPromise<unknown>(prefix);
        expect(() => fn(value)).not.toThrow();
      }),
    );

    vi.restoreAllMocks();
  });
});

describe('consoleLogPromise — contract', () => {
  it('returns the data unchanged with a prefix', () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const fn = consoleLogPromise<number>('prefix:');
    expect(fn(42)).toBe(42);
    vi.restoreAllMocks();
  });

  it('returns the data unchanged without a prefix', () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const fn = consoleLogPromise<string>();
    expect(fn('hello')).toBe('hello');
    vi.restoreAllMocks();
  });

  it('passes through null', () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const fn = consoleLogPromise<null>();
    expect(fn(null)).toBeNull();
    vi.restoreAllMocks();
  });

  it('passes through an array (same reference)', () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const arr = [1, 2, 3];
    const fn = consoleLogPromise<number[]>();
    expect(fn(arr)).toBe(arr);
    vi.restoreAllMocks();
  });

  it('logs with the given prefix', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const fn = consoleLogPromise<string>('TAG');
    fn('value');
    expect(spy).toHaveBeenCalledWith('TAG', 'value');
    vi.restoreAllMocks();
  });
});
