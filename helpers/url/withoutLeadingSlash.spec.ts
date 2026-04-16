/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { withoutLeadingSlash } from './withoutLeadingSlash';

describe('withoutLeadingSlash — property-based', () => {
  it('result never starts with /', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(withoutLeadingSlash(str)).not.toMatch(/^\//);
      }),
    );
  });

  it('idempotent: withoutLeadingSlash(withoutLeadingSlash(s)) === withoutLeadingSlash(s)', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(withoutLeadingSlash(withoutLeadingSlash(str))).toBe(withoutLeadingSlash(str));
      }),
    );
  });
});

describe('withoutLeadingSlash — contract', () => {
  it('null returns null', () => {
    expect(withoutLeadingSlash(null)).toBeNull();
  });

  it('undefined returns undefined', () => {
    expect(withoutLeadingSlash(undefined)).toBeUndefined();
  });

  it('empty string returns empty string', () => {
    expect(withoutLeadingSlash('')).toBe('');
  });

  it('single slash returns empty string', () => {
    expect(withoutLeadingSlash('/')).toBe('');
  });

  it('removes leading slash', () => {
    expect(withoutLeadingSlash('/foo')).toBe('foo');
  });

  it('no leading slash — unchanged', () => {
    expect(withoutLeadingSlash('foo')).toBe('foo');
  });

  it('double slash: removes only first slash', () => {
    expect(withoutLeadingSlash('//foo')).toBe('/foo');
  });
});
