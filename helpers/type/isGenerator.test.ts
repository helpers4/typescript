/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isGenerator } from './isGenerator';

describe('isGenerator', () => {
  it('should return true for generator instances', () => {
    function* gen() { yield 1; yield 2; }
    expect(isGenerator(gen())).toBe(true);
  });

  it('should return true for partially consumed generators', () => {
    function* gen() { yield 1; yield 2; }
    const g = gen();
    g.next();
    expect(isGenerator(g)).toBe(true);
  });

  it('should return false for generator functions', () => {
    function* gen() { yield 1; }
    expect(isGenerator(gen)).toBe(false);
  });

  it('should return false for async generators', () => {
    async function* asyncGen() { yield 1; }
    expect(isGenerator(asyncGen())).toBe(false);
  });

  it('should return false for arrays, iterators and other iterables', () => {
    expect(isGenerator([1, 2, 3])).toBe(false);
    expect(isGenerator([1][Symbol.iterator]())).toBe(false);
    expect(isGenerator('hello')).toBe(false);
  });

  it('should return false for null, undefined and primitives', () => {
    expect(isGenerator(null)).toBe(false);
    expect(isGenerator(undefined)).toBe(false);
    expect(isGenerator(42)).toBe(false);
    expect(isGenerator({})).toBe(false);
  });
});
