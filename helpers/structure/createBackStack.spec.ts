/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { createBackStack } from './createBackStack';

describe('createBackStack — property-based', () => {
  it('behaves as a stack: back returns the pushed entries in reverse order', () => {
    fc.assert(fc.property(fc.array(fc.integer()), (values) => {
      const stack = createBackStack(-1);
      for (const value of values) stack.push(value);
      const left: number[] = [];
      while (stack.canGoBack) left.push(stack.back()!);
      expect(left).toEqual(values.toReversed());
      expect(stack.current).toBe(-1);
    }));
  });

  it('never keeps more than limit past entries', () => {
    fc.assert(fc.property(fc.array(fc.integer(), { maxLength: 30 }), fc.nat({ max: 10 }), (values, limit) => {
      const stack = createBackStack(-1, { limit });
      for (const value of values) stack.push(value);
      let steps = 0;
      while (stack.back() !== undefined) steps++;
      expect(steps).toBe(Math.min(values.length, limit));
    }));
  });
});

describe('createBackStack — contract', () => {
  it('stores undefined as a regular entry', () => {
    const stack = createBackStack<string | undefined>('a');
    stack.push(undefined);
    expect(stack.current).toBeUndefined();
    expect(stack.canGoBack).toBe(true);
    stack.back();
    expect(stack.current).toBe('a');
  });
});
