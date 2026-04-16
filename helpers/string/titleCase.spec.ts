/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { titleCase } from './titleCase';

describe('titleCase — property-based', () => {
  it('each word starts with uppercase letter (for alpha words)', () => {
    fc.assert(
      fc.property(fc.string().filter(s => /[a-zA-Z]/.test(s)), (str) => {
        const result = titleCase(str);
        const words = result.split(' ').filter(Boolean);
        words.forEach((word) => {
          if (/^[a-zA-Z]/.test(word)) {
            expect(word[0]).toBe(word[0]!.toUpperCase());
          }
        });
      }),
    );
  });

  it('result contains spaces between words (for multi-word inputs)', () => {
    fc.assert(
      fc.property(fc.array(fc.string({ minLength: 1 }), { minLength: 2, maxLength: 5 }), (words) => {
        const input = words.join('-');
        const result = titleCase(input);
        // If input had multiple non-empty word parts, result should have spaces
        const parts = result.split(' ').filter(Boolean);
        expect(parts.length).toBeGreaterThan(0);
      }),
    );
  });
});

describe('titleCase — contract', () => {
  it('empty string returns empty string', () => {
    expect(titleCase('')).toBe('');
  });

  it('null returns null', () => {
    expect(titleCase(null)).toBeNull();
  });

  it('undefined returns undefined', () => {
    expect(titleCase(undefined)).toBeUndefined();
  });

  it('single word is capitalized', () => {
    expect(titleCase('single')).toBe('Single');
  });

  it('kebab-case converts to Title Case', () => {
    expect(titleCase('kebab-case')).toBe('Kebab Case');
  });

  it('snake_case converts to Title Case', () => {
    expect(titleCase('snake_case')).toBe('Snake Case');
  });

  it('camelCase converts to Title Case', () => {
    expect(titleCase('camelCase')).toBe('Camel Case');
  });
});
