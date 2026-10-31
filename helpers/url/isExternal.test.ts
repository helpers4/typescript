/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isExternal } from './isExternal';

describe('isExternal', () => {
  it('treats absolute http(s) URLs as external without a base', () => {
    expect(isExternal('https://example.com')).toBe(true);
    expect(isExternal('HTTP://example.com/a')).toBe(true);
    expect(isExternal('//cdn.example.com/a.js')).toBe(true);
  });

  it('treats paths, anchors, queries and other schemes as internal', () => {
    for (const url of ['/about', 'about', './a', '../a', '#top', '?q=1', '', 'mailto:a@b.c', 'tel:+33123', 'javascript:void(0)']) {
      expect(isExternal(url, 'https://example.com')).toBe(false);
      expect(isExternal(url)).toBe(false);
    }
  });

  it('compares the origin with a string base', () => {
    expect(isExternal('https://example.com/a', 'https://example.com')).toBe(false);
    expect(isExternal('https://example.com/a', 'https://example.com/deep/page')).toBe(false);
    expect(isExternal('https://other.com/a', 'https://example.com')).toBe(true);
  });

  it('accepts a URL object as base', () => {
    expect(isExternal('https://example.com/a', new URL('https://example.com'))).toBe(false);
    expect(isExternal('https://other.com', new URL('https://example.com'))).toBe(true);
    expect(isExternal('https://other.com', { href: 'https://example.com' })).toBe(true);
  });

  it('treats the default port of the scheme as no port, and ignores case and userinfo', () => {
    expect(isExternal('https://example.com:443/a', 'https://example.com')).toBe(false);
    expect(isExternal('http://example.com:80', 'http://example.com')).toBe(false);
    expect(isExternal('https://EXAMPLE.com/a', 'https://example.com')).toBe(false);
    expect(isExternal('https://user:pw@example.com/a', 'https://example.com')).toBe(false);
    expect(isExternal('https://[::1]:8080/a', 'https://[::1]:8080')).toBe(false);
    expect(isExternal('https://[::1]:8080/a', 'https://[::1]')).toBe(true);
  });

  it('treats another scheme, port or subdomain as another origin', () => {
    expect(isExternal('http://example.com', 'https://example.com')).toBe(true);
    expect(isExternal('https://example.com:8443', 'https://example.com')).toBe(true);
    expect(isExternal('https://www.example.com', 'https://example.com')).toBe(true);
  });

  it('resolves protocol-relative URLs against the base scheme', () => {
    expect(isExternal('//example.com/a', 'https://example.com')).toBe(false);
    expect(isExternal('//cdn.example.com/a', 'https://example.com')).toBe(true);
  });

  it('ignores surrounding whitespace', () => {
    expect(isExternal('  https://other.com  ', 'https://example.com')).toBe(true);
  });

  it('returns false when the URL or base cannot be parsed', () => {
    expect(isExternal('http://', 'https://example.com')).toBe(false);
    expect(isExternal('https://example.com', 'not a url')).toBe(false);
    expect(isExternal('//example.com', '//example.com')).toBe(false);
    expect(isExternal('https://example.com:', 'https://other.com')).toBe(true);
  });
});
