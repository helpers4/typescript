/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { statusToIcon } from './statusToIcon';

describe('statusToIcon — property-based', () => {
  it('always returns a non-empty string', () => {
    fc.assert(
      fc.property(fc.string(), (status) => {
        expect(statusToIcon(status).length).toBeGreaterThan(0);
      })
    );
  });

  it('unknown statuses return the fallback icon', () => {
    const known = new Set(['success', 'failure', 'skipped']);
    fc.assert(
      fc.property(
        fc.string().filter(s => !known.has(s)),
        (status) => {
          expect(statusToIcon(status)).toBe('⚠️');
        }
      )
    );
  });
});
