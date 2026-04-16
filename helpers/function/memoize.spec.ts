/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { memoize } from './memoize';

describe('memoize — property-based', () => {
  it('calling with same primitive arg returns referentially equal result', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        const fn = (x: number) => ({ value: x });
        const memoized = memoize(fn);
        const r1 = memoized(n);
        const r2 = memoized(n);
        // Same cached reference
        expect(r1).toBe(r2);
      })
    );
  });

  it('calls underlying function only once per unique argument set', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        let callCount = 0;
        const fn = (x: number) => { callCount++; return x * 2; };
        const memoized = memoize(fn);
        memoized(a);
        memoized(a);
        memoized(b);
        memoized(b);
        // Should be called at most 2 unique times (a and b may be equal)
        expect(callCount).toBeLessThanOrEqual(a === b ? 1 : 2);
      })
    );
  });
});

describe('memoize — contract', () => {
  it('calling memoized random function twice → same value', () => {
    const memoized = memoize(() => Math.random());
    const r1 = memoized();
    const r2 = memoized();
    expect(r1).toBe(r2);
  });

  it('different args → different calls (underlying fn called for each unique arg)', () => {
    let count = 0;
    const fn = (x: number) => { count++; return x; };
    const memoized = memoize(fn);
    memoized(1);
    memoized(2);
    expect(count).toBe(2);
  });

  it('object args: stringified differently → separate cache entries', () => {
    let count = 0;
    const fn = (obj: Record<string, number>) => { count++; return obj.v; };
    const memoized = memoize(fn);
    memoized({ v: 1 });
    memoized({ v: 2 });
    expect(count).toBe(2);
  });

  it('object args: same shape → same cache entry (JSON.stringify key)', () => {
    let count = 0;
    const fn = (obj: Record<string, number>) => { count++; return obj.v; };
    const memoized = memoize(fn);
    memoized({ v: 42 });
    memoized({ v: 42 });
    expect(count).toBe(1);
  });

  it('no-arg function: called multiple times → original called once', () => {
    let count = 0;
    const memoized = memoize(() => { count++; return 'hello'; });
    memoized();
    memoized();
    memoized();
    expect(count).toBe(1);
  });
});
