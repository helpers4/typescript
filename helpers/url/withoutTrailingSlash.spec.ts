/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { withoutTrailingSlash } from './withoutTrailingSlash';

describe('withoutTrailingSlash — property-based', () => {
  it('result never ends with /', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(withoutTrailingSlash(str)).not.toMatch(/\/$/);
      }),
    );
  });

  it('idempotent: withoutTrailingSlash(withoutTrailingSlash(s)) === withoutTrailingSlash(s)', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(withoutTrailingSlash(withoutTrailingSlash(str))).toBe(withoutTrailingSlash(str));
      }),
    );
  });
});

describe('withoutTrailingSlash — contract', () => {
  it('null returns null', () => {
    expect(withoutTrailingSlash(null)).toBeNull();
  });

  it('undefined returns undefined', () => {
    expect(withoutTrailingSlash(undefined)).toBeUndefined();
  });

  it('empty string returns empty string', () => {
    expect(withoutTrailingSlash('')).toBe('');
  });

  it('single slash returns empty string', () => {
    expect(withoutTrailingSlash('/')).toBe('');
  });

  it('removes trailing slash', () => {
    expect(withoutTrailingSlash('foo/')).toBe('foo');
  });

  it('no trailing slash — unchanged', () => {
    expect(withoutTrailingSlash('foo')).toBe('foo');
  });

  it('double trailing slash: removes only last slash', () => {
    expect(withoutTrailingSlash('foo//')).toBe('foo/');
  });
});
