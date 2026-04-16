/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { withLeadingSlash } from './withLeadingSlash';

describe('withLeadingSlash — property-based', () => {
  it('result always starts with /', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(withLeadingSlash(str)).toMatch(/^\//);
      }),
    );
  });

  it('idempotent: withLeadingSlash(withLeadingSlash(s)) === withLeadingSlash(s)', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(withLeadingSlash(withLeadingSlash(str))).toBe(withLeadingSlash(str));
      }),
    );
  });
});

describe('withLeadingSlash — contract', () => {
  it('null returns null', () => {
    expect(withLeadingSlash(null)).toBeNull();
  });

  it('undefined returns undefined', () => {
    expect(withLeadingSlash(undefined)).toBeUndefined();
  });

  it('empty string gets a slash', () => {
    expect(withLeadingSlash('')).toBe('/');
  });

  it('already has leading slash — no change', () => {
    expect(withLeadingSlash('/foo')).toBe('/foo');
  });

  it('no leading slash — adds one', () => {
    expect(withLeadingSlash('foo')).toBe('/foo');
  });

  it('double slash — not changed (already starts with /)', () => {
    expect(withLeadingSlash('//foo')).toBe('//foo');
  });

  it('single slash stays single slash', () => {
    expect(withLeadingSlash('/')).toBe('/');
  });
});
