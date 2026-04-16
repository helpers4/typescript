/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { capitalize } from './capitalize';

describe('capitalize — property-based', () => {
  it('first character is uppercase (if non-empty)', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (str) => {
        const result = capitalize(str);
        expect(result[0]).toBe(result[0]!.toUpperCase());
      }),
    );
  });

  it('rest of string (after first char) is all lowercase', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 2 }), (str) => {
        const result = capitalize(str);
        expect(result.slice(1)).toBe(result.slice(1).toLowerCase());
      }),
    );
  });

  it('result length === input length', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(capitalize(str)).toHaveLength(str.length);
      }),
    );
  });
});

describe('capitalize — contract', () => {
  it('empty string returns empty string', () => {
    expect(capitalize('')).toBe('');
  });

  it('null returns null', () => {
    expect(capitalize(null)).toBeNull();
  });

  it('undefined returns undefined', () => {
    expect(capitalize(undefined)).toBeUndefined();
  });

  it('all caps: ALLCAPS → Allcaps', () => {
    expect(capitalize('ALLCAPS')).toBe('Allcaps');
  });

  it('all lowercase: already → Already', () => {
    expect(capitalize('already')).toBe('Already');
  });

  it('numbers at start are unchanged', () => {
    expect(capitalize('123abc')).toBe('123abc');
  });

  it('leading space preserved', () => {
    expect(capitalize(' leading space')).toBe(' leading space');
  });
});
