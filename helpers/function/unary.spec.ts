/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { unary } from './unary';

describe('unary — property-based', () => {
  it('always calls the wrapped function with exactly one argument, regardless of how many it receives', () => {
    fc.assert(
      fc.property(fc.array(fc.anything(), { minLength: 1, maxLength: 5 }), (args) => {
        let receivedCount = -1;
        const wrapped = unary((...received: unknown[]) => {
          receivedCount = received.length;
        });
        (wrapped as (...a: unknown[]) => void)(...args);
        expect(receivedCount).toBe(1);
      }),
    );
  });

  it('the return value always matches calling the original function with just the first argument', () => {
    fc.assert(
      fc.property(fc.integer(), (a) => {
        const add = (x: number, y?: number) => x + (y ?? 0);
        expect(unary(add)(a)).toBe(add(a));
      }),
    );
  });
});
