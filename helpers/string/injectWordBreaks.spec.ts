/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { injectWordBreaks } from './injectWordBreaks';

const ZWS = '\u200B';
const stripZWS = (s: string): string => s.replaceAll(ZWS, '');

// Arbitrary that never contains ZWS — used for properties whose invariants
// only hold when the input has no pre-existing break hints.
const fcNoZWS = fc.string().filter((s) => !s.includes(ZWS));

describe('injectWordBreaks — property-based', () => {
  it('non-ZWS characters are always preserved (visible text unchanged)', () => {
    // The true contract: stripping ZWS from output == stripping ZWS from input.
    // Works for any input, including ones that already contain ZWS.
    fc.assert(
      fc.property(fc.string(), (str) => {
        const result = injectWordBreaks(str);
        expect(stripZWS(result)).toBe(stripZWS(str));
      }),
    );
  });

  it('output never starts or ends with a ZWS (input contains no ZWS)', () => {
    // Pre-existing ZWS at the start/end of the input would be passed through,
    // so we restrict to inputs that contain no ZWS.
    fc.assert(
      fc.property(fcNoZWS, (str) => {
        const result = injectWordBreaks(str);
        expect(result.startsWith(ZWS)).toBe(false);
        expect(result.endsWith(ZWS)).toBe(false);
      }),
    );
  });

  it('two consecutive ZWS never appear in the output (input contains no ZWS)', () => {
    // The implementation never inserts two ZWS in a row, but an existing ZWS
    // in the input can end up adjacent to an injected one.
    fc.assert(
      fc.property(fcNoZWS, (str) => {
        expect(injectWordBreaks(str)).not.toContain(ZWS + ZWS);
      }),
    );
  });

  it('strings containing only whitespace are returned unchanged', () => {
    fc.assert(
      fc.property(fc.stringMatching(/^\s*$/), (str) => {
        expect(injectWordBreaks(str)).toBe(str);
      }),
    );
  });

  it('result length is always >= input length (only ZWS are added)', () => {
    fc.assert(
      fc.property(fc.string(), (str) => {
        expect(injectWordBreaks(str).length).toBeGreaterThanOrEqual(str.length);
      }),
    );
  });

  it('null returns null (for any invocation)', () => {
    expect(injectWordBreaks(null)).toBeNull();
  });

  it('undefined returns undefined (for any invocation)', () => {
    expect(injectWordBreaks(undefined)).toBeUndefined();
  });
});

describe('injectWordBreaks — contract', () => {
  it('empty string returns empty string', () => {
    expect(injectWordBreaks('')).toBe('');
  });

  it('null returns null', () => {
    expect(injectWordBreaks(null)).toBeNull();
  });

  it('undefined returns undefined', () => {
    expect(injectWordBreaks(undefined)).toBeUndefined();
  });

  it('spec Example 1: atomic value -0.1% is indivisible', () => {
    expect(injectWordBreaks('-0.1%')).not.toContain(ZWS);
  });

  it('spec Example 2: foo,bar gets exactly one ZWS', () => {
    const result = injectWordBreaks('foo,bar');
    expect(result.split(ZWS)).toHaveLength(2);
  });

  it('spec Example 3: getUserProfileData gets exactly three ZWS', () => {
    const result = injectWordBreaks('getUserProfileData');
    expect(result.split(ZWS)).toHaveLength(4);
  });

  it('spec Example 4: path/to/my_file gets four ZWS', () => {
    const result = injectWordBreaks('path/to/my_file');
    expect(result.split(ZWS)).toHaveLength(5);
  });

  it('spec Example 5: Δ=-2.4E+6,avg gets exactly two ZWS', () => {
    const result = injectWordBreaks('Δ=-2.4E+6,avg');
    expect(result.split(ZWS)).toHaveLength(3);
  });

  it('spec Example 6: URL string produces no ZWS', () => {
    expect(injectWordBreaks('https://example.com/foo/bar')).not.toContain(ZWS);
  });

  it('strings without wrap opportunities are returned unchanged', () => {
    // A plain lowercase word with no camelCase, separators, or numbers
    expect(injectWordBreaks('hello')).toBe('hello');
  });

  it('ZWS is never directly adjacent to a pure-whitespace run', () => {
    // The spec rule is: no ZWS when either adjacent GROUP is whitespace.
    // A group is whitespace when it consists ENTIRELY of whitespace chars.
    // So ZWS between "/" and " !" is correct (" !" is not a whitespace group).
    // We verify the weaker property: if two chars around a ZWS are BOTH spaces,
    // something is wrong (ZWS never sits between two space characters).
    fc.assert(
      fc.property(fc.string(), (str) => {
        const result = injectWordBreaks(str);
        for (let i = 0; i < result.length; i++) {
          if (result[i] === ZWS) {
            const prev = result[i - 1];
            const next = result[i + 1];
            // ZWS should not sit between two whitespace characters
            if (prev !== undefined && next !== undefined) {
              expect(/\s/.test(prev) && /\s/.test(next)).toBe(false);
            }
          }
        }
      }),
    );
  });
});
