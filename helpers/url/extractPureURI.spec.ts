/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { extractPureURI } from './extractPureURI';

describe('extractPureURI — property-based', () => {
  it('result has no ? or #', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        const result = extractPureURI(str);
        expect(result).not.toContain('?');
        expect(result).not.toContain('#');
      }),
    );
  });

  it('result is a prefix of input', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        const result = extractPureURI(str);
        expect(str).toMatch(new RegExp('^' + result.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      }),
    );
  });
});

describe('extractPureURI — contract', () => {
  it('null returns null', () => {
    expect(extractPureURI(null)).toBeNull();
  });

  it('undefined returns undefined', () => {
    expect(extractPureURI(undefined)).toBeUndefined();
  });

  it('empty string returns empty string', () => {
    expect(extractPureURI('')).toBe('');
  });

  it('removes query string', () => {
    expect(extractPureURI('http://example.com/path?q=1&r=2')).toBe('http://example.com/path');
  });

  it('removes fragment', () => {
    expect(extractPureURI('http://example.com/path#section')).toBe('http://example.com/path');
  });

  it('removes both query and fragment, taking earliest', () => {
    expect(extractPureURI('http://example.com/path?q=1#section')).toBe('http://example.com/path');
  });

  it('javascript: URI is not validated (behavior documented)', () => {
    // No query or fragment, so returned as-is
    expect(extractPureURI('javascript:alert(1)')).toBe('javascript:alert(1)');
  });

  it('URL with no query or fragment returned unchanged', () => {
    expect(extractPureURI('http://example.com/path')).toBe('http://example.com/path');
  });
});
