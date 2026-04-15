/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isPromise } from './isPromise';

describe('isPromise', () => {
  it('should return true for native Promises', () => {
    expect(isPromise(Promise.resolve(42))).toBe(true);
    expect(isPromise(new Promise(() => { }))).toBe(true);
  });

  it('should return true for thenables with catch', () => {
    // eslint-disable-next-line unicorn/no-thenable -- Testing thenable detection
    const thenable = { then: () => { }, catch: () => { } };
    expect(isPromise(thenable)).toBe(true);
  });

  it('should return false for partial thenables', () => {
    // eslint-disable-next-line unicorn/no-thenable -- Testing thenable detection
    expect(isPromise({ then: () => { } })).toBe(false);
    expect(isPromise({ catch: () => { } })).toBe(false);
  });

  it('should return false for non-promise values', () => {
    expect(isPromise(42)).toBe(false);
    expect(isPromise('promise')).toBe(false);
    expect(isPromise(null)).toBe(false);
    expect(isPromise(undefined)).toBe(false);
    expect(isPromise({})).toBe(false);
    expect(isPromise([])).toBe(false);
  });
});
