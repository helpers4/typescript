/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { camelCase } from './camelCase';

describe('camelCase — property-based', () => {
  it('result contains no separator characters (space/underscore/hyphen)', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(camelCase(str)).not.toMatch(/[\s_-]/);
      }),
    );
  });

  it('result length is <= input length (separators removed, no new chars added)', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(camelCase(str).length).toBeLessThanOrEqual(str.length);
      }),
    );
  });

  // Not idempotent in general: input with punctuation glued to a letter (e.g. '! A' -> '!A')
  // re-lowercases that letter on a second pass, since it becomes the "first word" — the same
  // pre-existing edge case pascalCase/titleCase already have with their identical split-based
  // approach, not something specific to this fix.
});

describe('camelCase — contract', () => {
  it('empty string returns empty string', () => {
    expect(camelCase('')).toBe('');
  });

  it('null returns null', () => {
    expect(camelCase(null)).toBeNull();
  });

  it('undefined returns undefined', () => {
    expect(camelCase(undefined)).toBeUndefined();
  });

  it('simple kebab-case converts correctly', () => {
    expect(camelCase('hello-world')).toBe('helloWorld');
  });

  it('multiple words convert correctly', () => {
    expect(camelCase('multiple-words-here')).toBe('multipleWordsHere');
  });

  it('string without hyphens is unchanged', () => {
    expect(camelCase('alreadycamel')).toBe('alreadycamel');
  });

  it('splits on hyphens regardless of the case of what follows', () => {
    expect(camelCase('UPPER-CASE')).toBe('upperCase');
  });

  it('collapses leading/multiple dashes instead of leaving them in the output', () => {
    expect(camelCase('--leading-dashes')).toBe('leadingDashes');
  });
});
