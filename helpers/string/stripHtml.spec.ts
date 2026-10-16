/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { stripHtml } from './stripHtml';

describe('stripHtml — property-based', () => {
  it('never throws and is trimmed with single spaces', () => {
    fc.assert(fc.property(fc.string(), (s) => {
      const out = stripHtml(s);
      expect(out).toBe(out.trim());
      expect(out).not.toMatch(/\s{2,}/);
    }));
  });

  it('leaves plain text without markup or entities unchanged once normalized', () => {
    fc.assert(fc.property(fc.stringMatching(/^[a-z0-9 ]*$/), (s) => {
      expect(stripHtml(s)).toBe(s.replace(/\s+/g, ' ').trim());
    }));
  });

  it('wrapping text in a tag does not change the text', () => {
    fc.assert(fc.property(fc.stringMatching(/^[a-z0-9]+$/), (s) => {
      expect(stripHtml(`<span>${s}</span>`)).toBe(s);
    }));
  });
});

describe('stripHtml — contract', () => {
  it('handles an unterminated tag and an unterminated comment without throwing', () => {
    expect(() => stripHtml('<div')).not.toThrow();
    expect(() => stripHtml('<!-- never closed')).not.toThrow();
  });
});
