/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isExternalUrl } from './isExternalUrl';

describe('isExternalUrl', () => {
  it('treats absolute http(s) URLs as external without a base', () => {
    expect(isExternalUrl('https://example.com')).toBe(true);
    expect(isExternalUrl('HTTP://example.com/a')).toBe(true);
    expect(isExternalUrl('//cdn.example.com/a.js')).toBe(true);
  });

  it('treats paths, anchors, queries and other schemes as internal', () => {
    for (const url of ['/about', 'about', './a', '../a', '#top', '?q=1', '', 'mailto:a@b.c', 'tel:+33123', 'javascript:void(0)']) {
      expect(isExternalUrl(url, 'https://example.com')).toBe(false);
      expect(isExternalUrl(url)).toBe(false);
    }
  });

  it('compares the origin with a string base', () => {
    expect(isExternalUrl('https://example.com/a', 'https://example.com')).toBe(false);
    expect(isExternalUrl('https://example.com/a', 'https://example.com/deep/page')).toBe(false);
    expect(isExternalUrl('https://other.com/a', 'https://example.com')).toBe(true);
  });

  it('accepts a URL object as base', () => {
    expect(isExternalUrl('https://example.com/a', new URL('https://example.com'))).toBe(false);
    expect(isExternalUrl('https://other.com', new URL('https://example.com'))).toBe(true);
  });

  it('treats another scheme, port or subdomain as another origin', () => {
    expect(isExternalUrl('http://example.com', 'https://example.com')).toBe(true);
    expect(isExternalUrl('https://example.com:8443', 'https://example.com')).toBe(true);
    expect(isExternalUrl('https://www.example.com', 'https://example.com')).toBe(true);
  });

  it('resolves protocol-relative URLs against the base scheme', () => {
    expect(isExternalUrl('//example.com/a', 'https://example.com')).toBe(false);
    expect(isExternalUrl('//cdn.example.com/a', 'https://example.com')).toBe(true);
  });

  it('ignores surrounding whitespace', () => {
    expect(isExternalUrl('  https://other.com  ', 'https://example.com')).toBe(true);
  });

  it('returns false when the URL or base cannot be parsed', () => {
    expect(isExternalUrl('http://', 'https://example.com')).toBe(false);
    expect(isExternalUrl('https://example.com', 'not a url')).toBe(false);
  });
});
