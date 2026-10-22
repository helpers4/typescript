/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { safeJsonParse } from './safeJsonParse';

describe('safeJsonParse', () => {
  it('parses a valid JSON object', () => {
    expect(safeJsonParse<{ a: number }>('{"a":1}')).toEqual({ a: 1 });
  });

  it('parses a valid JSON array', () => {
    expect(safeJsonParse<number[]>('[1,2,3]')).toEqual([1, 2, 3]);
  });

  it('parses a JSON string', () => {
    expect(safeJsonParse<string>('"hello"')).toBe('hello');
  });

  it('parses a JSON number', () => {
    expect(safeJsonParse<number>('42')).toBe(42);
  });

  it('parses a JSON boolean', () => {
    expect(safeJsonParse<boolean>('true')).toBe(true);
  });

  it('parses JSON null', () => {
    expect(safeJsonParse<null>('null')).toBeNull();
  });

  it('returns null by default on invalid JSON', () => {
    expect(safeJsonParse('invalid')).toBeNull();
  });

  it('returns null by default on empty string', () => {
    expect(safeJsonParse('')).toBeNull();
  });

  it('returns null by default on truncated JSON', () => {
    expect(safeJsonParse('{"a":')).toBeNull();
  });

  it('returns the fallback on invalid JSON', () => {
    expect(safeJsonParse('invalid', [])).toEqual([]);
  });

  it('returns the fallback on empty string', () => {
    expect(safeJsonParse('', 0)).toBe(0);
  });

  it('returns the fallback when provided as null', () => {
    expect(safeJsonParse('bad', null)).toBeNull();
  });

  it('returns undefined when undefined is explicitly passed as fallback', () => {
    // Runtime must agree with the typings: passing undefined explicitly
    // should not be silently coerced into null.
    expect(safeJsonParse<unknown>('bad', undefined)).toBeUndefined();
  });

  it('returns a fallback object on failure', () => {
    const fallback = { error: true };
    expect(safeJsonParse('not-json', fallback)).toBe(fallback);
  });
});
