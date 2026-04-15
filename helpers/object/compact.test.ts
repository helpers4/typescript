/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { compact } from './compact';

describe('compact', () => {
  it('should remove null and undefined values', () => {
    expect(compact({ a: 1, b: null, c: undefined, d: 2 })).toEqual({ a: 1, d: 2 });
  });

  it('should remove false, 0 and empty string', () => {
    expect(compact({ a: false, b: 0, c: '', d: 'hello' })).toEqual({ d: 'hello' });
  });

  it('should remove NaN', () => {
    expect(compact({ a: NaN, b: 42 })).toEqual({ b: 42 });
  });

  it('should return empty object when all values are falsy', () => {
    expect(compact({ a: null, b: undefined, c: 0, d: false, e: '' })).toEqual({});
  });

  it('should return all entries when all values are truthy', () => {
    expect(compact({ a: 1, b: 'hello', c: true })).toEqual({ a: 1, b: 'hello', c: true });
  });

  it('should return empty object for empty input', () => {
    expect(compact({})).toEqual({});
  });

  it('should keep arrays and objects as truthy values', () => {
    expect(compact({ a: [], b: {}, c: null })).toEqual({ a: [], b: {} });
  });

  it('should return null when given null', () => {
    expect(compact(null)).toBeNull();
  });

  it('should return undefined when given undefined', () => {
    expect(compact(undefined)).toBeUndefined();
  });
});
