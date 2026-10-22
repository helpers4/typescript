/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { statusToBadge } from './statusToBadge';

describe('statusToBadge — property-based', () => {
  it('always returns a backtick-wrapped string', () => {
    fc.assert(
      fc.property(fc.string(), (status) => {
        const badge = statusToBadge(status);
        expect(badge.startsWith('`')).toBe(true);
        expect(badge.endsWith('`')).toBe(true);
      })
    );
  });
});
