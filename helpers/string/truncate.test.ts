/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { truncate } from './truncate';

describe('truncate', () => {
  it('returns the string unchanged when within limit', () => {
    expect(truncate('Hello', 10)).toBe('Hello');
  });

  it('returns undefined when input is undefined', () => {
    expect(truncate(undefined, 10)).toBeUndefined();
  });

  it('returns null when input is null', () => {
    expect(truncate(null, 10)).toBeNull();
  });

  it('returns the string unchanged when exactly at limit', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
  });

  it('truncates with default ellipsis (…), trimming a trailing space at the cut', () => {
    expect(truncate('Hello, world!', 8)).toBe('Hello,…');
  });

  it('truncates with custom ellipsis', () => {
    expect(truncate('Hello, world!', 8, '...')).toBe('Hello...');
  });

  it('result length equals maxLength when the cut does not land on whitespace', () => {
    const result = truncate('Hello world!', 8);
    expect(result).toBe('Hello w…');
    expect(result.length).toBe(8);
  });

  it('result is shorter than maxLength when the cut lands right after whitespace', () => {
    const result = truncate('Hello, world!', 8);
    expect(result.length).toBe(7);
  });

  it('result length equals maxLength when truncated (custom ellipsis)', () => {
    const result = truncate('Hello, world!', 8, '...');
    expect(result.length).toBe(8);
  });

  it('handles empty string', () => {
    expect(truncate('', 5)).toBe('');
  });

  it('handles maxLength equal to ellipsis length', () => {
    expect(truncate('Hello', 1, '…')).toBe('…');
  });

  it('handles a multi-char ellipsis longer than a short maxLength', () => {
    // ellipsis '...' is 3 chars, maxLength 2 → return ellipsis.slice(0, 2)
    expect(truncate('Hello', 2, '...')).toBe('..');
  });

  it('handles maxLength of 0', () => {
    expect(truncate('Hello', 0)).toBe('');
  });

  it('does not append ellipsis when string fits exactly', () => {
    expect(truncate('Hi', 2)).toBe('Hi');
    expect(truncate('Hi', 2)).not.toContain('…');
  });

  it('truncates a very long string', () => {
    const long = 'a'.repeat(1000);
    const result = truncate(long, 10);
    expect(result.length).toBe(10);
    expect(result.endsWith('…')).toBe(true);
  });

  it('does not trim a non-breaking space (U+00A0) at the cut point', () => {
    // Built explicitly from parts rather than a literal NBSP character in
    // source, to avoid any ambiguity about whether it's really there.
    const NBSP = String.fromCharCode(0x00a0);
    const input = 'Hello,' + NBSP + 'world!';
    const result = truncate(input, 8);
    expect(result).toBe('Hello,' + NBSP + '…');
    expect(result.length).toBe(8);
  });

  it('drops an incomplete surrogate pair at the cut point instead of emitting malformed UTF-16', () => {
    const result = truncate('a😀b', 3);
    expect(result).toBe('a…');
    expect(result).toBe(result.toWellFormed());
  });

  it('drops both a trailing space and the incomplete surrogate it exposes', () => {
    // Cutting at 4 lands on the high surrogate of 😀; after dropping it, the
    // space right before it becomes the new trailing character and must also
    // be trimmed (regular space, not NBSP).
    const result = truncate('hi 😀', 4);
    expect(result).toBe('hi…');
    expect(result).toBe(result.toWellFormed());
  });

  it('handles a slice that is only a lone high surrogate (nothing else left)', () => {
    // '😀x' is 3 UTF-16 code units (high surrogate, low surrogate, 'x'); slicing
    // to 1 code unit (maxLength 2 - ellipsis 1) keeps only the high surrogate,
    // which then gets dropped entirely, leaving just the ellipsis.
    const result = truncate('😀x', 2);
    expect(result).toBe('…');
    expect(result).toBe(result.toWellFormed());
  });

  it('excludes a whole ZWJ emoji sequence rather than cutting it in half', () => {
    // A "family" ZWJ sequence (4 people joined by 3 zero-width joiners) is 11
    // UTF-16 units — much larger than a bare surrogate pair. Any cut landing
    // inside it (checked across the whole span, not just one boundary) drops
    // the entire sequence rather than a visually broken partial family. Built
    // explicitly from code points rather than a literal sequence, to avoid
    // any ambiguity about which invisible joiner characters are actually there.
    const zwj = String.fromCharCode(0x200d);
    const family =
      String.fromCodePoint(0x1f468) + zwj + String.fromCodePoint(0x1f469) + zwj + String.fromCodePoint(0x1f467) + zwj + String.fromCodePoint(0x1f466);
    const input = 'hi ' + family + '!';
    for (let maxLength = 4; maxLength <= 10; maxLength++) {
      const result = truncate(input, maxLength);
      expect(result).toBe('hi…');
      expect(result).toBe(result.toWellFormed());
    }
  });

  it('excludes a whole flag (regional indicator pair) rather than cutting it in half', () => {
    // Flag emoji are two separate "regional indicator" code points (each
    // itself astral, so 4 UTF-16 units total) that only form a flag together
    // — splitting them leaves one indicator letter boxed/circled on its own.
    const flag = String.fromCodePoint(0x1f1eb) + String.fromCodePoint(0x1f1f7); // France
    const input = 'flag ' + flag + '!';
    // budget 8: "flag " (5) + one of the two indicator units (2) fits, not both
    const result = truncate(input, 9);
    expect(result).toBe('flag…');
  });

  it('excludes a base character together with its combining mark, not just the mark', () => {
    // Decomposed 'e' + COMBINING ACUTE ACCENT (U+0301) — 5 UTF-16 units total
    // for "caf" + the accented 'e'. A cut that would split the base 'e' from
    // its accent drops the whole cluster, not just the accent. Built
    // explicitly from parts (not a literal precomposed accented character) so
    // the assertions compare against the exact same decomposed sequence used
    // to build the input.
    const combiningAcute = String.fromCharCode(0x0301);
    const accentedE = 'e' + combiningAcute;
    const input = 'caf' + accentedE + ' test';
    expect(truncate(input, 6)).toBe('caf' + accentedE + '…'); // budget 5 exactly fits the whole cluster
    expect(truncate(input, 5)).toBe('caf…'); // budget 4 can't fit the cluster (5 units), drops it whole
  });

  it('handles a cluster longer than the initial search window (forces the window to expand)', () => {
    // A base char plus 100 stacked combining marks is 101 UTF-16 units — well
    // past the 40-unit starting window, so finding the true cluster boundary
    // requires the window to double at least once. There's a plain "hi "
    // prefix before it, so this doesn't reach all the way back to index 0.
    const combiningAcute = String.fromCharCode(0x0301);
    const longCluster = 'e' + combiningAcute.repeat(100);
    const input = 'hi ' + longCluster + '!';
    expect(truncate(input, 90)).toBe('hi…');
  });

  it('handles a cluster spanning the entire string, from index 0 (window expands to the very start)', () => {
    // No plain prefix at all — the whole input is one giant cluster, so the
    // window keeps doubling until it reaches index 0 and gives up there,
    // rather than looping forever.
    const combiningAcute = String.fromCharCode(0x0301);
    const wholeStringIsOneCluster = 'e' + combiningAcute.repeat(100);
    expect(truncate(wholeStringIsOneCluster, 90)).toBe('…');
  });
});
