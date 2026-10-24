/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { simplifyPolyline } from './simplifyPolyline';

const p = (x: number, y: number) => ({ x, y });

describe('simplifyPolyline', () => {
  it('removes a point closer than the tolerance', () => {
    expect(simplifyPolyline([p(0, 0), p(1, 0.1), p(2, 0)], 0.5)).toEqual([p(0, 0), p(2, 0)]);
  });

  it('keeps a point farther than the tolerance', () => {
    expect(simplifyPolyline([p(0, 0), p(1, 1), p(2, 0)], 0.5)).toEqual([p(0, 0), p(1, 1), p(2, 0)]);
  });

  it('removes a point exactly at the tolerance', () => {
    expect(simplifyPolyline([p(0, 0), p(1, 0.5), p(2, 0)], 0.5)).toEqual([p(0, 0), p(2, 0)]);
  });

  it('with a tolerance of 0, only removes collinear points', () => {
    expect(simplifyPolyline([p(0, 0), p(1, 0), p(2, 0), p(3, 1)], 0)).toEqual([p(0, 0), p(2, 0), p(3, 1)]);
  });

  it('keeps the shape of a closed outline', () => {
    const square = [p(0, 0), p(5, 0), p(10, 0), p(10, 10), p(0, 10), p(0, 0)];
    expect(simplifyPolyline(square, 1)).toEqual([p(0, 0), p(10, 0), p(10, 10), p(0, 10), p(0, 0)]);
  });

  it('measures the distance to the segment ends, beyond the segment', () => {
    expect(simplifyPolyline([p(0, 0), p(-3, 0), p(1, 0)], 1)).toEqual([p(0, 0), p(-3, 0), p(1, 0)]);
  });

  it('returns a copy of short polylines', () => {
    const line = [p(0, 0), p(1, 1)];
    expect(simplifyPolyline(line, 1)).toEqual(line);
    expect(simplifyPolyline(line, 1)).not.toBe(line);
    expect(simplifyPolyline([], 1)).toEqual([]);
  });

  it('throws on a negative or NaN tolerance', () => {
    expect(() => simplifyPolyline([], -1)).toThrow(RangeError);
    expect(() => simplifyPolyline([], Number.NaN)).toThrow(RangeError);
  });

  // Instrumented by Stryker (mutation testing), this takes a few seconds on a CI runner: the
  // default 5 s test timeout fails the whole shard's initial test run.
  it('handles very long polylines', { timeout: 60_000 }, () => {
    const zigzag = Array.from({ length: 100_000 }, (_, i) => p(i, i % 2));
    expect(simplifyPolyline(zigzag, 2)).toEqual([p(0, 0), p(99_999, 1)]);
    expect(simplifyPolyline(zigzag.slice(0, 2_000), 0.1)).toHaveLength(2_000);
  });
});
