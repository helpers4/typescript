/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { escapeHtml } from './escapeHtml';
import { unescapeHtml } from './unescapeHtml';

describe('unescapeHtml — property-based', () => {
  it('round-trips any string through escapeHtml then unescapeHtml', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        expect(unescapeHtml(escapeHtml(s))).toBe(s);
      }),
    );
  });

  it('a string with no ampersands is returned unchanged', () => {
    fc.assert(
      fc.property(fc.stringMatching(/^[^&]*$/), (s) => {
        expect(unescapeHtml(s)).toBe(s);
      }),
    );
  });
});
