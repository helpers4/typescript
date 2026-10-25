/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isHostname } from './isHostname';

const label = (n: number, ch = 'a') => ch.repeat(n);
// Builds a name of exactly `total` characters made of labels of at most 63 characters.
const nameOfLength = (total: number) => {
  const parts: string[] = [];
  let left = total;
  while (left > 0) {
    if (left <= 63) {
      parts.push(label(left));
      break;
    }
    parts.push(label(61));
    left -= 62;
  }
  return parts.join('.');
};

describe('isHostname', () => {
  it.each([
    'example.com',
    'localhost',
    'a',
    'a.b',
    'EXAMPLE.COM',
    'Sub.Example.Com',
    'my-host.example.org',
    'a-b-c.d',
    'a--b.com',
    'xn--nxasmq6b.com',
    'xn--bcher-kva.example',
    '123.example.com',
    '1.2.3.example',
    '192.168.0.1.example.com',
    '3com.com',
    'example.c0m',
    'example.1a',
    'a'.repeat(63) + '.com',
    nameOfLength(253),
    nameOfLength(63),
  ])('accepts %s', (name) => {
    expect(isHostname(name)).toBe(true);
  });

  it.each([
    ['empty string', ''],
    ['single dot', '.'],
    ['leading dot', '.example.com'],
    ['empty inner label', 'a..b'],
    ['trailing dot (default)', 'example.com.'],
    ['double trailing dot', 'example.com..'],
    ['leading hyphen', '-a.com'],
    ['trailing hyphen', 'a-.com'],
    ['leading hyphen on last label', 'a.-com'],
    ['trailing hyphen on last label', 'a.com-'],
    ['lone hyphen', '-'],
    ['underscore (default)', 'a_b.com'],
    ['leading underscore (default)', '_dmarc.example.com'],
    ['IPv4', '192.168.0.1'],
    ['bare number', '123'],
    ['all-numeric TLD', 'example.123'],
    ['IPv6', '::1'],
    ['bracketed IPv6', '[::1]'],
    ['unicode label', 'bücher.example'],
    ['unicode TLD', 'example.中国'],
    ['emoji', '😀.com'],
    ['space', 'a b.com'],
    ['leading space', ' example.com'],
    ['trailing space', 'example.com '],
    ['tab', 'example\t.com'],
    ['newline', 'example.com\n'],
    ['port', 'example.com:80'],
    ['path', 'a/b'],
    ['scheme', 'http://x'],
    ['query', 'example.com?x=1'],
    ['userinfo', 'user@example.com'],
    ['wildcard', '*.example.com'],
    ['label of 64', 'a'.repeat(64) + '.com'],
    ['name of 254', nameOfLength(254)],
    ['NUL byte', 'exa\0mple.com'],
  ])('rejects %s', (_name, value) => {
    expect(isHostname(value)).toBe(false);
  });

  it('checks the length boundaries precisely', () => {
    expect(isHostname(label(63))).toBe(true);
    expect(isHostname(label(64))).toBe(false);
    expect(nameOfLength(253)).toHaveLength(253);
    expect(isHostname(nameOfLength(253))).toBe(true);
    expect(isHostname(nameOfLength(254))).toBe(false);
  });

  it('does not count the trailing dot in the 253 limit', () => {
    expect(isHostname(nameOfLength(253) + '.', { allowTrailingDot: true })).toBe(true);
    expect(isHostname(nameOfLength(254) + '.', { allowTrailingDot: true })).toBe(false);
  });

  it.each([null, undefined, 42, 0, true, {}, [], ['a.com'], () => 'a.com', Symbol('a'), 10n, new String('a.com')])(
    'rejects non-string %s',
    (value) => {
      expect(isHostname(value)).toBe(false);
    },
  );

  describe('allowTrailingDot', () => {
    const opts = { allowTrailingDot: true };
    it('accepts one trailing dot', () => {
      expect(isHostname('example.com.', opts)).toBe(true);
      expect(isHostname('localhost.', opts)).toBe(true);
    });
    it('still accepts names without it', () => {
      expect(isHostname('example.com', opts)).toBe(true);
    });
    it('refuses a bare dot, two dots and a numeric TLD', () => {
      expect(isHostname('.', opts)).toBe(false);
      expect(isHostname('example.com..', opts)).toBe(false);
      expect(isHostname('192.168.0.1.', opts)).toBe(false);
      expect(isHostname('-a.', opts)).toBe(false);
    });
    it('is off when false', () => {
      expect(isHostname('example.com.', { allowTrailingDot: false })).toBe(false);
    });
  });

  describe('allowUnderscore', () => {
    const opts = { allowUnderscore: true };
    it('accepts underscores anywhere in a label', () => {
      expect(isHostname('_dmarc.example.com', opts)).toBe(true);
      expect(isHostname('a_b.example.com', opts)).toBe(true);
      expect(isHostname('a_.example.com', opts)).toBe(true);
      expect(isHostname('_a._tcp.example.com', opts)).toBe(true);
      expect(isHostname('example._tld', opts)).toBe(true);
      expect(isHostname('_', opts)).toBe(true);
    });
    it('keeps the hyphen rules', () => {
      expect(isHostname('_-.com', opts)).toBe(false);
      expect(isHostname('-_a.com', opts)).toBe(false);
    });
    it('treats a label with an underscore as non-numeric', () => {
      expect(isHostname('example.1_2', opts)).toBe(true);
      expect(isHostname('example.12', opts)).toBe(false);
    });
    it('still refuses other characters', () => {
      expect(isHostname('a$b.com', opts)).toBe(false);
    });
  });

  it('works as a type guard', () => {
    const value: unknown = 'example.com';
    if (isHostname(value)) {
      const s: string = value;
      expect(s).toBe('example.com');
    }
  });
});
