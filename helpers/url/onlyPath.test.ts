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
import { onlyPath } from './onlyPath';

describe('onlyPath', () => {
  test('should return the path without query and fragment', () => {
    expect(onlyPath('/path')).toBe('/path')
  });
  test('should return the path without query and fragment when query is present', () => {
    expect(onlyPath('/path?query=thing')).toBe('/path')
  });
  test('should return the path without query and fragment when fragment is present', () => {
    expect(onlyPath('/path#fragment')).toBe('/path')
  });
  test('should return the path without query and fragment when both query and fragment are present', () => {
    expect(onlyPath('/path?query=thing#fragment')).toBe('/path')
  });
  test('should return undefined if input is undefined', () => {
    expect(onlyPath(undefined)).toBe(undefined)
  });
  test('should return null if input is null', () => {
    expect(onlyPath(null)).toBe(null)
  });

  describe('security edge cases', () => {
    test('should handle javascript: protocol', () => {
      expect(onlyPath('javascript:alert(1)')).toBe('javascript:alert(1)');
    });

    test('should handle data: URI with query', () => {
      expect(onlyPath('data:text/html,payload?x=1')).toBe('data:text/html,payload');
    });

    test('should handle URL with credentials', () => {
      expect(onlyPath('https://user:pass@host.com/path?q=1')).toBe('https://user:pass@host.com/path');
    });

    test('should handle double-encoded characters', () => {
      expect(onlyPath('/path%252F..%252Fetc?x=1')).toBe('/path%252F..%252Fetc');
    });

    test('should handle null bytes', () => {
      expect(onlyPath('/path%00evil#frag')).toBe('/path%00evil');
    });
  });
});
