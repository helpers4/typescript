/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { escapeRegExp } from './escapeRegExp';

describe('escapeRegExp — property-based', () => {
  it('never throws when the result is used to build a RegExp', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        expect(() => new RegExp(escapeRegExp(s))).not.toThrow();
      }),
    );
  });

  it('the resulting pattern always matches the original string literally', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        const pattern = new RegExp(escapeRegExp(s));
        expect(pattern.test(s)).toBe(true);
      }),
    );
  });

  it('a string with no metacharacters is returned unchanged', () => {
    fc.assert(
      fc.property(fc.stringMatching(/^[a-zA-Z0-9 ]*$/), (s) => {
        expect(escapeRegExp(s)).toBe(s);
      }),
    );
  });
});
