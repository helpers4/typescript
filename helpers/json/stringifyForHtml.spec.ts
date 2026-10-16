/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { stringifyForHtml } from './stringifyForHtml';

describe('stringifyForHtml — property-based', () => {
  it('never contains a raw <, >, &, U+2028 or U+2029', () => {
    fc.assert(fc.property(fc.jsonValue(), (value) => {
      expect(stringifyForHtml(value)).not.toMatch(/[<>&\u2028\u2029]/);
    }));
  });

  it('parses back to the same value', () => {
    fc.assert(fc.property(fc.jsonValue(), (value) => {
      expect(JSON.parse(stringifyForHtml(value))).toEqual(JSON.parse(JSON.stringify(value)));
    }));
  });

  it('round-trips strings built from the dangerous characters', () => {
    const dangerous = fc.string({ unit: fc.constantFrom('<', '>', '&', '/', '!', '-', '\u2028', '\u2029', 'a') });
    fc.assert(fc.property(dangerous, (s) => {
      expect(JSON.parse(stringifyForHtml(s))).toBe(s);
    }));
  });
});

describe('stringifyForHtml — contract', () => {
  it('serializes primitives', () => {
    expect(stringifyForHtml(null)).toBe('null');
    expect(stringifyForHtml(42)).toBe('42');
    expect(stringifyForHtml('')).toBe('""');
  });
});
