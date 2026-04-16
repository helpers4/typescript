/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { snakeCase } from './snakeCase';

describe('snakeCase — property-based', () => {
  it('result is all lowercase', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        const result = snakeCase(str);
        expect(result).toBe(result.toLowerCase());
      }),
    );
  });

  it('result contains no spaces or hyphens', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(snakeCase(str)).not.toMatch(/[\s-]/);
      }),
    );
  });
});

describe('snakeCase — contract', () => {
  it('empty string returns empty string', () => {
    expect(snakeCase('')).toBe('');
  });

  it('null returns null', () => {
    expect(snakeCase(null)).toBeNull();
  });

  it('undefined returns undefined', () => {
    expect(snakeCase(undefined)).toBeUndefined();
  });

  it('camelCase converts correctly', () => {
    expect(snakeCase('camelCase')).toBe('camel_case');
  });

  it('PascalCase converts correctly', () => {
    expect(snakeCase('PascalCase')).toBe('pascal_case');
  });

  it('kebab-case converts correctly', () => {
    expect(snakeCase('kebab-case')).toBe('kebab_case');
  });

  it('already_snake remains unchanged', () => {
    expect(snakeCase('already_snake')).toBe('already_snake');
  });
});
