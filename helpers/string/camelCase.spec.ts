/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { camelCase } from './camelCase';

describe('camelCase — property-based', () => {
  it('result contains no -[a-z] patterns (the only pattern converted)', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(camelCase(str)).not.toMatch(/-[a-z]/);
      }),
    );
  });

  it('result length is <= input length (hyphens removed, no new chars added)', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(camelCase(str).length).toBeLessThanOrEqual(str.length);
      }),
    );
  });
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

  it('uppercase letter after hyphen is NOT uppercased (only lowercase matched)', () => {
    // The regex is /-([a-z])/ so uppercase after hyphen is not changed
    expect(camelCase('UPPER-CASE')).toBe('UPPER-CASE');
  });

  it('leading dashes remain, and subsequent -[a-z] patterns are converted', () => {
    // '--leading-dashes': '-l' and '-d' match, '-' before 'l' is consumed
    // Result: '-LeadingDashes' (the leading '--' has one '-' consumed by the '-l' match)
    expect(camelCase('--leading-dashes')).toBe('-LeadingDashes');
  });
});
