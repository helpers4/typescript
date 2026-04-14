/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { pascalCase } from './pascalCase';

describe('pascalCase', () => {
  it('should convert camelCase to PascalCase', () => {
    expect(pascalCase('camelCase')).toBe('CamelCase');
  });

  it('should convert kebab-case to PascalCase', () => {
    expect(pascalCase('hello-world')).toBe('HelloWorld');
  });

  it('should convert snake_case to PascalCase', () => {
    expect(pascalCase('hello_world')).toBe('HelloWorld');
  });

  it('should convert spaces to PascalCase', () => {
    expect(pascalCase('hello world')).toBe('HelloWorld');
  });

  it('should handle already PascalCase', () => {
    expect(pascalCase('PascalCase')).toBe('PascalCase');
  });

  it('should handle multiple uppercase letters', () => {
    expect(pascalCase('XMLHttpRequest')).toBe('XmlHttpRequest');
  });

  it('should handle empty string', () => {
    expect(pascalCase('')).toBe('');
  });

  it('should handle single word', () => {
    expect(pascalCase('hello')).toBe('Hello');
    expect(pascalCase('HELLO')).toBe('Hello');
  });

  it('should handle mixed separators', () => {
    expect(pascalCase('foo-bar_baz qux')).toBe('FooBarBazQux');
  });

  it('should handle consecutive uppercase', () => {
    expect(pascalCase('getHTTPResponse')).toBe('GetHttpResponse');
  });
});
