/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { interpolate } from './interpolate';

describe('interpolate', () => {
  it('blends numbers', () => {
    expect(interpolate(0, 10, 0)).toBe(0);
    expect(interpolate(0, 10, 0.5)).toBe(5);
    expect(interpolate(0, 10, 1)).toBe(10);
  });

  it('does not clamp t', () => {
    expect(interpolate(0, 10, 1.2)).toBe(12);
    expect(interpolate(0, 10, -0.5)).toBe(-5);
  });

  it('blends arrays and nested objects', () => {
    expect(interpolate([0, 0, 0], [255, 128, 0], 0.5)).toEqual([127.5, 64, 0]);
    expect(interpolate({ x: 0, size: { w: 10, h: 20 }, path: [0, 4] }, { x: 50, size: { w: 30, h: 0 }, path: [2, 0] }, 0.5))
      .toEqual({ x: 25, size: { w: 20, h: 10 }, path: [1, 2] });
  });

  it('returns new values', () => {
    const from = { x: [1] };
    const result = interpolate(from, { x: [1] }, 0.5);
    expect(result).toEqual(from);
    expect(result).not.toBe(from);
    expect(result.x).not.toBe(from.x);
  });

  it('takes the keys of from and ignores extra keys in to', () => {
    expect(interpolate({ x: 0 }, { x: 10, y: 5 } as { x: number }, 0.5)).toEqual({ x: 5 });
  });

  it('throws on mismatched shapes, naming where', () => {
    const bad = (from: unknown, to: unknown) => () => interpolate(from as number, to as number, 0.5);
    expect(bad(1, { a: 1 })).toThrow(/at the root/);
    expect(bad([1, 2], [1])).toThrow(TypeError);
    expect(bad([1], { 0: 1 })).toThrow(TypeError);
    expect(bad({ a: 1 }, [1])).toThrow(TypeError);
    expect(bad({ a: 1 }, 1)).toThrow(TypeError);
    expect(bad({ a: { b: 1 } }, { a: {} })).toThrow(/at \.a\.b/);
    expect(bad({ a: [1, { b: 1 }] }, { a: [1, 2] })).toThrow(/at \.a\[1\]/);
  });
});
