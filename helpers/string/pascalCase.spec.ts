/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { pascalCase } from './pascalCase';

describe('pascalCase — property-based', () => {
  it('first char is uppercase (if non-empty)', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }).filter(s => /[a-zA-Z]/.test(s)), (str) => {
        const result = pascalCase(str);
        if (result.length > 0) {
          expect(result[0]).toBe(result[0]!.toUpperCase());
        }
      }),
    );
  });

  it('result contains no spaces, hyphens, or underscores', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(pascalCase(str)).not.toMatch(/[\s\-_]/);
      }),
    );
  });
});

describe('pascalCase — contract', () => {
  it('empty string returns empty string', () => {
    expect(pascalCase('')).toBe('');
  });

  it('null returns null', () => {
    expect(pascalCase(null)).toBeNull();
  });

  it('undefined returns undefined', () => {
    expect(pascalCase(undefined)).toBeUndefined();
  });

  it('kebab-case converts correctly', () => {
    expect(pascalCase('kebab-case')).toBe('KebabCase');
  });

  it('snake_case converts correctly', () => {
    expect(pascalCase('snake_case')).toBe('SnakeCase');
  });

  it('camelCase converts correctly', () => {
    expect(pascalCase('camelCase')).toBe('CamelCase');
  });

  it('already PascalCase: each word gets capitalized+lowercased', () => {
    // 'HelloWorld' → split on camel boundary → 'Hello World' → ['Hello', 'World'] → 'HelloWorld'
    // But word.slice(1).toLowerCase() means 'ELLO' would become 'ello'
    expect(pascalCase('HelloWorld')).toBe('HelloWorld');
  });

  it('multiple spaces handled', () => {
    expect(pascalCase('multiple   spaces')).toBe('MultipleSpaces');
  });
});
