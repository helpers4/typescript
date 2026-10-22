/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { formatCompact } from './formatCompact';

describe('formatCompact (property-based)', () => {
  it('always returns a non-empty string for any finite number', () => {
    fc.assert(
      fc.property(fc.float({ noNaN: true, noDefaultInfinity: true }), (n) => {
        expect(formatCompact(n, 'en').length).toBeGreaterThan(0);
      }),
    );
  });

  it('result for positive values does not start with a minus sign', () => {
    fc.assert(
      fc.property(fc.float({ min: 0, noNaN: true, noDefaultInfinity: true }), (n) => {
        expect(formatCompact(n, 'en').startsWith('-')).toBe(false);
      }),
    );
  });

  it('result for negative values starts with a minus sign', () => {
    fc.assert(
      fc.property(fc.float({ max: -1, noNaN: true, noDefaultInfinity: true }), (n) => {
        expect(formatCompact(n, 'en').startsWith('-')).toBe(true);
      }),
    );
  });
});
