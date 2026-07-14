/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { removeDiacritics } from './removeDiacritics';

describe('removeDiacritics — property-based', () => {
  it('a plain ASCII letter/digit string is returned unchanged', () => {
    fc.assert(
      fc.property(fc.stringMatching(/^[a-zA-Z0-9 ]*$/), (s) => {
        expect(removeDiacritics(s)).toBe(s);
      }),
    );
  });

  it('the result never contains a combining diacritical mark', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        const result = removeDiacritics(s);
        expect(/[\u0300-\u036f]/.test(result)).toBe(false);
      }),
    );
  });

  it('is idempotent', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        const once = removeDiacritics(s);
        expect(removeDiacritics(once)).toBe(once);
      }),
    );
  });
});
