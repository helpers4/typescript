/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { escapeHtml } from './escapeHtml';

describe('escapeHtml (property-based)', () => {
  it('result never contains raw & < > " \'', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        const result = escapeHtml(str);
        expect(result).not.toMatch(/[<>"']/);  // & appears in entities like &amp;
      }),
    );
  });

  it('strings with no special chars are returned unchanged', () => {
    fc.assert(
      fc.property(fc.stringMatching(/^[a-zA-Z0-9 \t\n.,;:!?@#%^*()\-_+=[\]{}|/\\`~]*$/), (str) => {
        expect(escapeHtml(str)).toBe(str);
      }),
    );
  });

  it('result length is >= input length (escaping never shortens)', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(escapeHtml(str).length).toBeGreaterThanOrEqual(str.length);
      }),
    );
  });
});
