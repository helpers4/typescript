/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { relativeURLToAbsolute } from './relativeURLToAbsolute';

// Note: relativeURLToAbsolute uses document.baseURI — requires browser-like environment (happy-dom)
// No property-based tests here as the result depends on runtime environment state

describe('relativeURLToAbsolute — contract', () => {
  it('relative path is converted to absolute URL', () => {
    const result = relativeURLToAbsolute('foo');
    expect(result).toMatch(/^https?:\/\//);
    expect(result).toContain('foo');
  });

  it('path-absolute URL is converted to absolute URL', () => {
    const result = relativeURLToAbsolute('/foo');
    expect(result).toMatch(/^https?:\/\//);
    expect(result).toContain('/foo');
  });

  it('result does not have double slashes (except protocol)', () => {
    const result = relativeURLToAbsolute('/foo');
    const withoutProtocol = result.replace(/^https?:\/\//, '');
    expect(withoutProtocol).not.toContain('//');
  });

  it('already absolute-looking path returns a valid URL', () => {
    // Even if passing an absolute URL as a string, it gets concatenated to base
    const result = relativeURLToAbsolute('/absolute/path');
    expect(result).toMatch(/^https?:\/\//);
  });

  it('empty string results in a URL ending with just the base', () => {
    const result = relativeURLToAbsolute('');
    expect(result).toMatch(/^https?:\/\//);
  });
});
