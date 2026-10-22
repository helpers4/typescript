/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { excerpt } from './excerpt';

describe('excerpt — property-based', () => {
  it('never exceeds maxLength', () => {
    fc.assert(
      fc.property(fc.string(), fc.integer({ min: 1, max: 500 }), (text, maxLength) => {
        expect(excerpt(text, maxLength).length).toBeLessThanOrEqual(maxLength);
      }),
    );
  });

  it('never returns text unchanged if it is longer than maxLength', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), fc.integer({ min: 1, max: 500 }), (text, maxLength) => {
        const collapsedLength = text.trim().replace(/\s+/g, ' ').length;
        if (collapsedLength > maxLength) {
          expect(excerpt(text, maxLength).length).toBeLessThan(collapsedLength);
        }
      }),
    );
  });

  it('never throws for arbitrary input', () => {
    fc.assert(
      fc.property(fc.string(), fc.integer({ min: 0, max: 500 }), (text, maxLength) => {
        expect(() => excerpt(text, maxLength)).not.toThrow();
      }),
    );
  });

  it('is a no-op (identity) whenever the collapsed text already fits', () => {
    fc.assert(
      fc.property(fc.string(), fc.integer({ min: 1, max: 500 }), (text, maxLength) => {
        const collapsed = text.trim().replace(/\s+/g, ' ');
        if (collapsed.length <= maxLength) {
          expect(excerpt(text, maxLength)).toBe(collapsed);
        }
      }),
    );
  });
});

describe('excerpt — contract', () => {
  it('never leaves a dangling space before the ellipsis', () => {
    const text = `${'word '.repeat(30)}`;
    const result = excerpt(text, 20);
    expect(result).not.toMatch(/ …$/);
  });

  it('handles maxLength of 0', () => {
    expect(() => excerpt('hello', 0)).not.toThrow();
  });

  it('handles an empty string', () => {
    expect(excerpt('', 10)).toBe('');
  });
});
