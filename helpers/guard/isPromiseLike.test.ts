/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isPromiseLike } from './isPromiseLike';

describe('isPromiseLike', () => {
  it('should return true for native Promises', () => {
    expect(isPromiseLike(Promise.resolve(1))).toBe(true);
    expect(isPromiseLike(new Promise(() => {}))).toBe(true);
    expect(isPromiseLike(Promise.reject(new Error('x')).catch(() => {}))).toBe(true);
  });

  it('should return true for objects with a then method', () => {
    // eslint-disable-next-line unicorn/no-thenable -- Testing thenable detection
    expect(isPromiseLike({ then: () => {} })).toBe(true);
    // eslint-disable-next-line unicorn/no-thenable -- Testing thenable detection
    expect(isPromiseLike({ then: () => {}, catch: () => {} })).toBe(true);
  });

  it('should return true for functions with a then method', () => {
    // eslint-disable-next-line unicorn/no-thenable -- Testing thenable detection
    const fn = Object.assign(() => {}, { then: () => {} });
    expect(isPromiseLike(fn)).toBe(true);
  });

  it('should return false when then is not a function', () => {
    // eslint-disable-next-line unicorn/no-thenable -- Testing thenable detection
    expect(isPromiseLike({ then: 'not-a-function' })).toBe(false);
    // eslint-disable-next-line unicorn/no-thenable -- Testing thenable detection
    expect(isPromiseLike({ then: null })).toBe(false);
    // eslint-disable-next-line unicorn/no-thenable -- Testing thenable detection
    expect(isPromiseLike({ then: 42 })).toBe(false);
  });

  it('should return false for null', () => {
    expect(isPromiseLike(null)).toBe(false);
  });

  it('should return false for primitives', () => {
    expect(isPromiseLike(42)).toBe(false);
    expect(isPromiseLike('hello')).toBe(false);
    expect(isPromiseLike(true)).toBe(false);
    expect(isPromiseLike(Symbol('x'))).toBe(false);
    expect(isPromiseLike(undefined)).toBe(false);
  });

  it('should return false for objects without then', () => {
    expect(isPromiseLike({})).toBe(false);
    expect(isPromiseLike([])).toBe(false);
  });
});
