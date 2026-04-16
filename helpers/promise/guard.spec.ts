/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { guard } from './guard';

describe('guard — property-based', () => {
  it('if fn does not throw, returns fn()', () => {
    fc.assert(
      fc.property(fc.integer(), (value: number) => {
        const result = guard(() => value, -1);
        expect(result).toBe(value);
      }),
    );
  });

  it('if fn throws, returns defaultValue', () => {
    fc.assert(
      fc.property(fc.integer(), fc.string(), (defaultValue: number, msg: string) => {
        const result = guard(() => { throw new Error(msg); }, defaultValue);
        expect(result).toBe(defaultValue);
      }),
    );
  });
});

describe('guard — contract', () => {
  it('sync throwing fn returns defaultValue', () => {
    const result = guard(() => { throw new Error('boom'); }, 'fallback');
    expect(result).toBe('fallback');
  });

  it('sync success returns the value', () => {
    const result = guard(() => 42, 0);
    expect(result).toBe(42);
  });

  it('async throwing fn returns defaultValue', async () => {
    const result = await guard(async () => { throw new Error('async boom'); }, 'async fallback');
    expect(result).toBe('async fallback');
  });

  it('async success returns the value', async () => {
    const result = await guard(async () => 'async ok', 'fallback');
    expect(result).toBe('async ok');
  });

  it('nested error in sync fn returns defaultValue', () => {
    const result = guard(() => {
      const inner = guard(() => { throw new Error('inner'); }, null);
      if (inner === null) throw new Error('outer');
      return inner;
    }, 'outer fallback');
    expect(result).toBe('outer fallback');
  });

  it('returns null defaultValue', () => {
    const result = guard<string | null>(() => { throw new Error(); }, null);
    expect(result).toBeNull();
  });
});
