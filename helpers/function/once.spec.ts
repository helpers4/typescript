/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { once } from './once';

describe('once — property-based', () => {
  it('always returns the same value regardless of subsequent args', () => {
    fc.assert(
      fc.property(
        fc.integer(),
        fc.array(fc.integer(), { minLength: 0, maxLength: 10 }),
        (first, rest) => {
          const wrapped = once((x: number) => x * 3);
          const firstResult = wrapped(first);
          for (const arg of rest) {
            expect(wrapped(arg)).toBe(firstResult);
          }
        }
      )
    );
  });

  it('calls underlying function exactly once regardless of call count', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),
        (callCount) => {
          let invocations = 0;
          const wrapped = once(() => { invocations++; return invocations; });
          for (let i = 0; i < callCount; i++) {
            wrapped();
          }
          expect(invocations).toBe(1);
        }
      )
    );
  });
});
