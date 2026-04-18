/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/*
 * This program is under the terms of the GNU Lesser General Public License version 3
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { describe, expect, test } from "vitest";
import { cleanPath } from './cleanPath';

describe('cleanPath', () => {
  test('should remove duplicate slashes', () => {
    expect(cleanPath('/path//to///resource')).toBe('/path/to/resource')
  });
  test('should handle URLs with protocol correctly', () => {
    expect(cleanPath('http://example.com//path//to///resource')).toBe(
      'http://example.com/path/to/resource',
    )
  });
  test('should return undefined if input is undefined', () => {
    expect(cleanPath(undefined)).toBe(undefined)
  });
  test('should return null if input is null', () => {
    expect(cleanPath(null)).toBe(null)
  });
  test('should handle path without duplicate slashes', () => {
    expect(cleanPath('/path/to/resource')).toBe('/path/to/resource')
  });
  describe('security edge cases', () => {
    test('should handle javascript: protocol', () => {
      expect(cleanPath('javascript:alert(1)')).toBe('javascript:alert(1)');
    });

    test('should handle data: URI', () => {
      expect(cleanPath('data:text/html,<script>alert(1)</script>')).toBe('data:text/html,<script>alert(1)</script>');
    });

    test('should handle path traversal sequences', () => {
      expect(cleanPath('/path/../../etc/passwd')).toBe('/path/../../etc/passwd');
    });

    test('should handle double-encoded slashes', () => {
      expect(cleanPath('/path%252F..%252Fetc')).toBe('/path%252F..%252Fetc');
    });

    test('should handle null bytes in path', () => {
      expect(cleanPath('/path%00/evil')).toBe('/path%00/evil');
    });

    test('should handle URL with credentials', () => {
      expect(cleanPath('https://user:pass@host.com//path')).toBe('https://user:pass@host.com/path');
    });

    test('should handle protocol-relative URL with duplicate slashes', () => {
      expect(cleanPath('//evil.com//path//to')).toBe('//evil.com/path/to');
    });
  });

  test('should handle URLs with fragments and queries', () => {
    expect(cleanPath('/path//to///resource?query=thing#fragment')).toBe(
      '/path/to/resource?query=thing#fragment',
    )
    expect(
      cleanPath('http://example.com//path//to///resource?query=thing#fragment'),
    ).toBe('http://example.com/path/to/resource?query=thing#fragment')
  });
});
