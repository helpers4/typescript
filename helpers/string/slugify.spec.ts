/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { slugify } from './slugify';

describe('slugify — property-based', () => {
  it('result only contains [a-z0-9-]', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        const result = slugify(str);
        expect(result).toMatch(/^[a-z0-9-]*$/);
      }),
    );
  });

  it('no leading or trailing hyphens', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        const result = slugify(str);
        if (result.length > 0) {
          expect(result[0]).not.toBe('-');
          expect(result[result.length - 1]).not.toBe('-');
        }
      }),
    );
  });

  it('no consecutive hyphens', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(slugify(str)).not.toMatch(/--/);
      }),
    );
  });
});

describe('slugify — contract', () => {
  it('empty string returns empty string', () => {
    expect(slugify('')).toBe('');
  });

  it('null returns null', () => {
    expect(slugify(null)).toBeNull();
  });

  it('undefined returns undefined', () => {
    expect(slugify(undefined)).toBeUndefined();
  });

  it('Hello World! → hello-world', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
  });

  it('only symbols returns empty string', () => {
    expect(slugify('!@#$%^&*()')).toBe('');
  });

  it('XSS: script tags are stripped to safe output', () => {
    const result = slugify('<script>alert(1)</script>');
    expect(result).toMatch(/^[a-z0-9-]*$/);
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });

  it('path traversal characters are handled safely', () => {
    const result = slugify('../../etc/passwd');
    expect(result).toMatch(/^[a-z0-9-]*$/);
  });

  it('SQL injection string is handled safely', () => {
    const result = slugify("'; DROP TABLE users; --");
    expect(result).toMatch(/^[a-z0-9-]*$/);
  });

  it('unicode with diacritics: é → e (NFKD normalization)', () => {
    expect(slugify('résumé')).toBe('resume');
  });

  it('emoji are replaced with hyphens or stripped', () => {
    const result = slugify('hello 🌍 world');
    expect(result).toMatch(/^[a-z0-9-]*$/);
    expect(result).not.toContain('🌍');
  });

  it('apostrophes are stripped (not converted to hyphens)', () => {
    expect(slugify("don't")).toBe('dont');
  });

  it('consecutive special chars produce single hyphen', () => {
    expect(slugify('hello   world')).toBe('hello-world');
  });
});
