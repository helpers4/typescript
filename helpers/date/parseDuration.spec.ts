/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { formatDuration } from './formatDuration';
import { parseDuration } from './parseDuration';

describe('parseDuration — property-based', () => {
  it('round-trips through formatDuration for any non-negative whole-second duration', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 100_000_000 }), (seconds) => {
        const ms = seconds * 1000;
        expect(parseDuration(formatDuration(ms))).toBe(ms);
      }),
    );
  });

  it('round-trips negative durations too', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 100_000_000 }), (seconds) => {
        const ms = -seconds * 1000;
        expect(parseDuration(formatDuration(ms))).toBe(ms);
      }),
    );
  });

  it('never throws for arbitrary string input', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        expect(() => parseDuration(s)).not.toThrow();
      }),
    );
  });
});
