/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { onlyPath } from './onlyPath';

describe('onlyPath — property-based', () => {
  it('result has no ? or #', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        const result = onlyPath(str);
        expect(result).not.toContain('?');
        expect(result).not.toContain('#');
      }),
    );
  });

  it('idempotent: onlyPath(onlyPath(url)) === onlyPath(url)', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(onlyPath(onlyPath(str))).toBe(onlyPath(str));
      }),
    );
  });
});

describe('onlyPath — contract', () => {
  it('null returns null', () => {
    expect(onlyPath(null)).toBeNull();
  });

  it('undefined returns undefined', () => {
    expect(onlyPath(undefined)).toBeUndefined();
  });

  it('empty string returns empty string', () => {
    expect(onlyPath('')).toBe('');
  });

  it('path with query string returns path only', () => {
    expect(onlyPath('http://example.com/path?q=1&r=2')).toBe('http://example.com/path');
  });

  it('path with fragment returns path only', () => {
    expect(onlyPath('http://example.com/path#section')).toBe('http://example.com/path');
  });

  it('path with both query and fragment returns path only', () => {
    expect(onlyPath('http://example.com/path?q=1#section')).toBe('http://example.com/path');
  });

  it('path without host is handled', () => {
    expect(onlyPath('/path?query=thing')).toBe('/path');
  });

  it('URL without query or fragment returned unchanged', () => {
    expect(onlyPath('/path/to/resource')).toBe('/path/to/resource');
  });
});
