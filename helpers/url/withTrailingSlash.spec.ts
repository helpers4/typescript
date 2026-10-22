/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { withTrailingSlash } from './withTrailingSlash';

describe('withTrailingSlash — property-based', () => {
  it('result always ends with /', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(withTrailingSlash(str)).toMatch(/\/$/);
      }),
    );
  });

  it('idempotent: withTrailingSlash(withTrailingSlash(s)) === withTrailingSlash(s)', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(withTrailingSlash(withTrailingSlash(str))).toBe(withTrailingSlash(str));
      }),
    );
  });
});

describe('withTrailingSlash — contract', () => {
  it('null returns null', () => {
    expect(withTrailingSlash(null)).toBeNull();
  });

  it('undefined returns undefined', () => {
    expect(withTrailingSlash(undefined)).toBeUndefined();
  });

  it('empty string gets a slash', () => {
    expect(withTrailingSlash('')).toBe('/');
  });

  it('already has trailing slash — no change', () => {
    expect(withTrailingSlash('foo/')).toBe('foo/');
  });

  it('no trailing slash — adds one', () => {
    expect(withTrailingSlash('foo')).toBe('foo/');
  });

  it('single slash stays single slash', () => {
    expect(withTrailingSlash('/')).toBe('/');
  });
});
