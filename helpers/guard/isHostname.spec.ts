/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isHostname } from './isHostname';

const alnum = fc.constantFrom(...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split(''));
const alnumHyphen = fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'.split(''));

const label = fc
  .tuple(alnum, fc.string({ unit: alnumHyphen, maxLength: 20 }), alnum)
  .map(([a, mid, b]) => a + mid + b);
// A TLD starts with a letter, so it is never all digits.
const tld = fc.tuple(fc.constantFrom('a', 'Z', 'x'), label).map(([l, rest]) => l + rest);

const hostname = fc.tuple(fc.array(label, { maxLength: 4 }), tld).map(([head, last]) => [...head, last].join('.'));

describe('isHostname — property-based', () => {
  it('accepts every generated valid hostname', () => {
    fc.assert(
      fc.property(hostname, (h) => {
        expect(isHostname(h)).toBe(true);
        expect(isHostname(h.toUpperCase())).toBe(true);
        expect(isHostname(h + '.', { allowTrailingDot: true })).toBe(true);
        expect(isHostname(h + '.')).toBe(false);
      }),
    );
  });

  it('refuses a name once a space, a colon or a slash is inserted anywhere', () => {
    fc.assert(
      fc.property(hostname, fc.constantFrom(' ', ':', '/'), fc.nat(), (h, ch, n) => {
        const at = n % (h.length + 1);
        expect(isHostname(h.slice(0, at) + ch + h.slice(at))).toBe(false);
      }),
    );
  });

  it('refuses names with a non-ASCII character', () => {
    fc.assert(
      fc.property(hostname, fc.constantFrom('é', '中', '😀'), (h, ch) => {
        expect(isHostname(ch + h)).toBe(false);
        expect(isHostname(h + ch)).toBe(false);
      }),
    );
  });

  it('never throws and always returns a boolean', () => {
    fc.assert(
      fc.property(fc.anything(), (v) => {
        expect(typeof isHostname(v)).toBe('boolean');
        expect(typeof isHostname(v, { allowTrailingDot: true, allowUnderscore: true })).toBe('boolean');
      }),
    );
  });

  it('never throws on arbitrary strings', () => {
    fc.assert(
      fc.property(fc.string({ unit: 'binary' }), (s) => {
        expect(typeof isHostname(s)).toBe('boolean');
      }),
    );
  });
});

describe('isHostname — contract', () => {
  it('stays fast on adversarial input', () => {
    const inputs = [
      'a'.repeat(250) + '!',
      'a-'.repeat(120) + '!',
      'a.'.repeat(125) + '-',
      '-'.repeat(253),
      'a'.repeat(100_000),
      'a.'.repeat(50_000),
      '1.'.repeat(120) + '1',
    ];
    const start = performance.now();
    for (const input of inputs) {
      for (let i = 0; i < 20; i++) isHostname(input);
    }
    expect(performance.now() - start).toBeLessThan(500);
  });

  it('handles the documented edge cases', () => {
    expect(isHostname('')).toBe(false);
    expect(isHostname('.')).toBe(false);
    expect(isHostname('localhost')).toBe(true);
    expect(isHostname('192.168.0.1')).toBe(false);
    expect(isHostname('example.com:80')).toBe(false);
    expect(isHostname('http://x')).toBe(false);
  });
});
