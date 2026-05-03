/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { escapeTableCell } from './escapeTableCell';

describe('escapeTableCell — property-based', () => {
  it('result contains no unescaped pipes', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        const result = escapeTableCell(str);
        // No unescaped pipes: every | is preceded by \
        expect(result.replace(/\\\|/g, '')).not.toContain('|');
      })
    );
  });

  it('result contains no newlines', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(escapeTableCell(str)).not.toContain('\n');
      })
    );
  });
});
