/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { cleanPath } from './cleanPath';

describe('cleanPath — property-based', () => {
  it('result has no consecutive slashes except in protocol', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        const result = cleanPath(str);
        if (result === null || result === undefined) return;
        // Remove the protocol part (e.g. "https://") before checking
        const withoutProtocol = result.replace(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//, '//PROTOCOL//');
        expect(withoutProtocol.replace(/^\/\/PROTOCOL\/\//, '')).not.toMatch(/\/\//);
      }),
    );
  });

  it('idempotent: cleanPath(cleanPath(url)) === cleanPath(url)', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(cleanPath(cleanPath(str))).toBe(cleanPath(str));
      }),
    );
  });
});

describe('cleanPath — contract', () => {
  it('null returns null', () => {
    expect(cleanPath(null)).toBeNull();
  });

  it('undefined returns undefined', () => {
    expect(cleanPath(undefined)).toBeUndefined();
  });

  it('empty string returns empty string', () => {
    expect(cleanPath('')).toBe('');
  });

  it('triple slashes are partially collapsed (regex requires a non-colon char before first slash)', () => {
    // The regex ([^:]\/)\/+ requires a non-colon char before the first slash
    // '///path' → '//path' (one round) then '//path' is unchanged (leading // stays)
    expect(cleanPath('///path')).toBe('//path');
  });

  it('protocol double slashes are preserved', () => {
    expect(cleanPath('http://example.com//a//b///c')).toBe('http://example.com/a/b/c');
  });

  it('path with no duplicates is unchanged', () => {
    expect(cleanPath('/path/to/resource')).toBe('/path/to/resource');
  });

  it('path traversal sequences are not sanitized (behavior documented)', () => {
    // cleanPath only removes duplicate slashes, not path traversal
    const result = cleanPath('/../../../etc/passwd');
    expect(result).toBe('/../../../etc/passwd');
  });

  it('javascript: URI is not modified (behavior documented)', () => {
    const result = cleanPath('javascript:alert(1)');
    expect(result).toBe('javascript:alert(1)');
  });

  it('https with multiple duplicate slashes', () => {
    expect(cleanPath('https://example.com//a//b///c')).toBe('https://example.com/a/b/c');
  });
});
