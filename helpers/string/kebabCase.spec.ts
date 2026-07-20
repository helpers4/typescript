/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { kebabCase } from './kebabCase';

describe('kebabCase — property-based', () => {
  it('result is all lowercase', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        const result = kebabCase(str);
        expect(result).toBe(result.toLowerCase());
      }),
    );
  });

  it('result contains no uppercase letters', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(kebabCase(str)).toMatch(/^[^A-Z]*$/);
      }),
    );
  });

  it('never starts/ends with a hyphen and never has consecutive hyphens', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(kebabCase(str)).not.toMatch(/^-|-$|--/);
      }),
    );
  });
});

describe('kebabCase — contract', () => {
  it('empty string returns empty string', () => {
    expect(kebabCase('')).toBe('');
  });

  it('null returns null', () => {
    expect(kebabCase(null)).toBeNull();
  });

  it('undefined returns undefined', () => {
    expect(kebabCase(undefined)).toBeUndefined();
  });

  it('camelCase converts correctly', () => {
    expect(kebabCase('camelCase')).toBe('camel-case');
  });

  it('PascalCase converts correctly', () => {
    expect(kebabCase('PascalCase')).toBe('pascal-case');
  });

  it('XMLParser converts with correct boundary detection', () => {
    expect(kebabCase('XMLParser')).toBe('xml-parser');
  });

  it('already lowercase string unchanged', () => {
    expect(kebabCase('alreadykebab')).toBe('alreadykebab');
  });

  it('snake_case converts correctly', () => {
    expect(kebabCase('user_name')).toBe('user-name');
  });

  it('is idempotent — applying it twice equals applying it once', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        const once = kebabCase(str);
        expect(kebabCase(once)).toBe(once);
      }),
    );
  });
});
