/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { titleCase } from './titleCase';

describe('titleCase', () => {
  it('should split on hyphens and capitalize each word', () => {
    expect(titleCase('hello-world')).toBe('Hello World');
  });

  it('should split on underscores and capitalize each word', () => {
    expect(titleCase('hello_world')).toBe('Hello World');
  });

  it('should split on spaces and capitalize each word', () => {
    expect(titleCase('hello world')).toBe('Hello World');
  });

  it('should lowercase the rest of each word', () => {
    expect(titleCase('HELLO-WORLD')).toBe('Hello World');
  });

  it('should handle mixed separators', () => {
    expect(titleCase('foo-bar_baz qux')).toBe('Foo Bar Baz Qux');
  });

  it('should handle consecutive separators', () => {
    expect(titleCase('foo--bar__baz')).toBe('Foo Bar Baz');
  });

  it('should handle camelCase', () => {
    expect(titleCase('queryItems')).toBe('Query Items');
  });

  it('should handle PascalCase', () => {
    expect(titleCase('PascalCase')).toBe('Pascal Case');
  });

  it('should handle consecutive uppercase letters', () => {
    expect(titleCase('XMLHttpRequest')).toBe('Xml Http Request');
    expect(titleCase('getHTTPResponse')).toBe('Get Http Response');
  });

  it('should handle empty string', () => {
    expect(titleCase('')).toBe('');
  });

  it('should handle single word', () => {
    expect(titleCase('hello')).toBe('Hello');
    expect(titleCase('HELLO')).toBe('Hello');
  });
});
