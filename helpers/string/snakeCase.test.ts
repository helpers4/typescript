/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { snakeCase } from './snakeCase';

describe('snakeCase', () => {
  it('should convert camelCase to snake_case', () => {
    expect(snakeCase('camelCase')).toBe('camel_case');
  });

  it('should convert PascalCase to snake_case', () => {
    expect(snakeCase('PascalCase')).toBe('pascal_case');
  });

  it('should convert kebab-case to snake_case', () => {
    expect(snakeCase('kebab-case')).toBe('kebab_case');
  });

  it('should convert spaces to snake_case', () => {
    expect(snakeCase('hello world')).toBe('hello_world');
  });

  it('should handle multiple uppercase letters', () => {
    expect(snakeCase('XMLHttpRequest')).toBe('xml_http_request');
  });

  it('should handle already snake_case', () => {
    expect(snakeCase('already_snake')).toBe('already_snake');
  });

  it('should handle empty string', () => {
    expect(snakeCase('')).toBe('');
  });

  it('should handle single word', () => {
    expect(snakeCase('hello')).toBe('hello');
    expect(snakeCase('Hello')).toBe('hello');
  });

  it('should handle mixed separators', () => {
    expect(snakeCase('foo-bar_baz qux')).toBe('foo_bar_baz_qux');
  });

  it('should handle consecutive uppercase', () => {
    expect(snakeCase('getHTTPResponse')).toBe('get_http_response');
  });

  it('should return null when given null', () => {
    expect(snakeCase(null)).toBeNull();
  });

  it('should return undefined when given undefined', () => {
    expect(snakeCase(undefined)).toBeUndefined();
  });
});
