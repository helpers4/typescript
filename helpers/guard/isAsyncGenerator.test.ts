/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isAsyncGenerator } from './isAsyncGenerator';

describe('isAsyncGenerator', () => {
  it('should return true for async generator instances', () => {
    async function* gen() { yield 1; }
    expect(isAsyncGenerator(gen())).toBe(true);
  });

  it('should return true for partially consumed async generators', () => {
    async function* gen() { yield 1; yield 2; }
    const g = gen();
    void g.next();
    expect(isAsyncGenerator(g)).toBe(true);
  });

  it('should return false for async generator functions', () => {
    async function* gen() { yield 1; }
    expect(isAsyncGenerator(gen)).toBe(false);
  });

  it('should return false for sync generators', () => {
    function* gen() { yield 1; }
    expect(isAsyncGenerator(gen())).toBe(false);
  });

  it('should return false for other values', () => {
    expect(isAsyncGenerator(null)).toBe(false);
    expect(isAsyncGenerator(undefined)).toBe(false);
    expect(isAsyncGenerator(42)).toBe(false);
    expect(isAsyncGenerator({})).toBe(false);
    expect(isAsyncGenerator([])).toBe(false);
  });
});
