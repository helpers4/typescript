/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { words } from './words';

describe('words', () => {
  it('splits whitespace-separated words', () => {
    expect(words('hello world')).toEqual(['hello', 'world']);
  });

  it('splits camelCase', () => {
    expect(words('camelCaseString')).toEqual(['camel', 'Case', 'String']);
  });

  it('splits PascalCase', () => {
    expect(words('PascalCase')).toEqual(['Pascal', 'Case']);
  });

  it('splits snake_case', () => {
    expect(words('snake_case')).toEqual(['snake', 'case']);
  });

  it('splits kebab-case', () => {
    expect(words('kebab-case')).toEqual(['kebab', 'case']);
  });

  it('splits SCREAMING_SNAKE_CASE', () => {
    expect(words('SCREAMING_SNAKE')).toEqual(['SCREAMING', 'SNAKE']);
  });

  it('splits acronyms followed by title-case', () => {
    expect(words('XMLParser')).toEqual(['XML', 'Parser']);
  });

  it('splits letters and digits', () => {
    expect(words('foo123bar')).toEqual(['foo', '123', 'bar']);
  });

  it('returns empty array for empty string', () => {
    expect(words('')).toEqual([]);
  });

  it('returns empty array for punctuation-only string', () => {
    expect(words('---')).toEqual([]);
  });

  it('handles single word', () => {
    expect(words('hello')).toEqual(['hello']);
  });

  it('handles multiple spaces', () => {
    expect(words('hello   world')).toEqual(['hello', 'world']);
  });

  it('handles mixed case patterns', () => {
    expect(words('getHTTPSResponse')).toEqual(['get', 'HTTPS', 'Response']);
  });

  it('returns [] for null', () => {
    expect(words(null)).toEqual([]);
  });

  it('returns [] for undefined', () => {
    expect(words(undefined)).toEqual([]);
  });
});
