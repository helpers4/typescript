/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { injectWordBreaks } from './injectWordBreaks';

const ZWS = '\u200B';

// Helper to strip ZWS from output (ensures visible text is unchanged)
const stripZWS = (s: string): string => s.replaceAll(ZWS, '');

describe('injectWordBreaks', () => {
  // -------------------------------------------------------------------------
  // Null / undefined passthrough
  // -------------------------------------------------------------------------

  it('returns null when given null', () => {
    expect(injectWordBreaks(null)).toBeNull();
  });

  it('returns undefined when given undefined', () => {
    expect(injectWordBreaks(undefined)).toBeUndefined();
  });

  // -------------------------------------------------------------------------
  // Empty / whitespace-only strings
  // -------------------------------------------------------------------------

  it('returns empty string unchanged', () => {
    expect(injectWordBreaks('')).toBe('');
  });

  it('returns whitespace-only strings unchanged (no ZWS added around whitespace)', () => {
    expect(injectWordBreaks('   ')).toBe('   ');
  });

  // -------------------------------------------------------------------------
  // Spec validation table — Example 1: -0.1%
  // -------------------------------------------------------------------------

  it('Example 1 — atomic value "-0.1%" is never split', () => {
    expect(injectWordBreaks('-0.1%')).toBe('-0.1%');
  });

  // -------------------------------------------------------------------------
  // Spec validation table — Example 2: foo,bar
  // -------------------------------------------------------------------------

  it('Example 2 — trailing comma attaches left: "foo,bar" → "foo," + ZWS + "bar"', () => {
    expect(injectWordBreaks('foo,bar')).toBe(`foo,${ZWS}bar`);
  });

  // -------------------------------------------------------------------------
  // Spec validation table — Example 3: getUserProfileData
  // -------------------------------------------------------------------------

  it('Example 3 — camelCase splits at lowercase→uppercase boundaries', () => {
    expect(injectWordBreaks('getUserProfileData')).toBe(
      `get${ZWS}User${ZWS}Profile${ZWS}Data`,
    );
  });

  // -------------------------------------------------------------------------
  // Spec validation table — Example 4: path/to/my_file
  // -------------------------------------------------------------------------

  it('Example 4 — structural separator "/" is a wrap point', () => {
    expect(injectWordBreaks('path/to/my_file')).toBe(
      `path${ZWS}/${ZWS}to${ZWS}/${ZWS}my_file`,
    );
  });

  // -------------------------------------------------------------------------
  // Spec validation table — Example 5: Δ=-2.4E+6,avg
  // -------------------------------------------------------------------------

  it('Example 5 — scientific notation preserved, comma attaches left', () => {
    expect(injectWordBreaks('Δ=-2.4E+6,avg')).toBe(`Δ=${ZWS}-2.4E+6,${ZWS}avg`);
  });

  // -------------------------------------------------------------------------
  // Spec validation table — Example 6: protected URL
  // -------------------------------------------------------------------------

  it('Example 6 — URL is a D0 protected span (no ZWS injected)', () => {
    expect(injectWordBreaks('https://example.com/foo/bar')).toBe(
      'https://example.com/foo/bar',
    );
  });

  // -------------------------------------------------------------------------
  // D0 — Protected spans
  // -------------------------------------------------------------------------

  it('D0 — URL adjacent to regular text: no ZWS next to the URL group', () => {
    const result = injectWordBreaks('visit https://example.com now');
    // Whitespace surrounds the URL, so no ZWS is expected anywhere
    expect(result).toBe('visit https://example.com now');
  });

  it('D0 — email address is protected', () => {
    const result = injectWordBreaks('contact test@example.com please');
    expect(result).toBe('contact test@example.com please');
  });

  it('D0 — HTML tag is protected (no ZWS adjacent to d0 groups)', () => {
    // <b> and </b> are D0 protected — ZWS is never inserted next to them
    expect(injectWordBreaks('<b>bold</b>')).toBe('<b>bold</b>');
  });

  it('D0 — HTML entity is protected', () => {
    expect(injectWordBreaks('a &amp; b')).toBe('a &amp; b');
  });

  it('D0 — numeric HTML entity is protected', () => {
    expect(injectWordBreaks('&lt;foo&gt;')).toBe('&lt;foo&gt;');
  });

  it('D0 — hex HTML entity is protected', () => {
    expect(injectWordBreaks('&#x2F;')).toBe('&#x2F;');
  });

  // -------------------------------------------------------------------------
  // Pass 1 — Atomic values
  // -------------------------------------------------------------------------

  it('Pass 1 — positive signed integer is atomic', () => {
    expect(injectWordBreaks('+42')).toBe('+42');
  });

  it('Pass 1 — negative integer is atomic', () => {
    expect(injectWordBreaks('-12')).toBe('-12');
  });

  it('Pass 1 — decimal number is atomic', () => {
    expect(injectWordBreaks('3.1415')).toBe('3.1415');
  });

  it('Pass 1 — localized number (1,234.56) is atomic', () => {
    expect(injectWordBreaks('1,234.56')).toBe('1,234.56');
  });

  it('Pass 1 — scientific notation (1e-3) is atomic', () => {
    expect(injectWordBreaks('1e-3')).toBe('1e-3');
  });

  it('Pass 1 — number with unit (12ms) is atomic', () => {
    expect(injectWordBreaks('12ms')).toBe('12ms');
  });

  it('Pass 1 — number with GHz unit is atomic', () => {
    expect(injectWordBreaks('3GHz')).toBe('3GHz');
  });

  it('Pass 1 — number with degree+Celsius unit is atomic', () => {
    expect(injectWordBreaks('-5°C')).toBe('-5°C');
  });

  it('Pass 1 — atomic value embedded in larger string wraps around it', () => {
    const result = injectWordBreaks('avg=-2.4E+6,max');
    expect(result).toBe(`avg${ZWS}=${ZWS}-2.4E+6,${ZWS}max`);
  });

  it('Pass 1 — multiple atomic values in one string', () => {
    const result = injectWordBreaks('-1.5ms+2.3GHz');
    expect(result).toBe(`-1.5ms${ZWS}+2.3GHz`);
  });

  // -------------------------------------------------------------------------
  // Pass 2 — Word / non-word splitting
  // -------------------------------------------------------------------------

  it('Pass 2 — plain words separated by whitespace: no ZWS added', () => {
    expect(injectWordBreaks('hello world')).toBe('hello world');
  });

  it('Pass 2 — word separated by equals sign gets ZWS', () => {
    expect(injectWordBreaks('key=value')).toBe(`key${ZWS}=${ZWS}value`);
  });

  it('Pass 2 — all non-word characters stay together when no structural separator', () => {
    // "==" is non-word but has no /@, so it stays as one token
    expect(injectWordBreaks('a==b')).toBe(`a${ZWS}==${ZWS}b`);
  });

  // -------------------------------------------------------------------------
  // Pass 3 — camelCase
  // -------------------------------------------------------------------------

  it('Pass 3 — single word without camelCase is unchanged', () => {
    expect(injectWordBreaks('hello')).toBe('hello');
  });

  it('Pass 3 — all-uppercase abbreviation is not split', () => {
    // No lowercase→uppercase boundary in "HTML"
    expect(injectWordBreaks('HTML')).toBe('HTML');
  });

  it('Pass 3 — all-caps prefix has no lowercase→uppercase boundary: no split', () => {
    // "HTMLParser": every transition is upper→upper or upper→lower, never lower→upper
    expect(injectWordBreaks('HTMLParser')).toBe('HTMLParser');
  });

  it('Pass 3 — lowercase prefix before all-caps: split at first lower→upper', () => {
    // "myHTMLParser": y(lower)→H(upper) is the only boundary
    expect(injectWordBreaks('myHTMLParser')).toBe(`my${ZWS}HTMLParser`);
  });

  it('Pass 3 — multiple camelCase words', () => {
    expect(injectWordBreaks('myComponentName')).toBe(
      `my${ZWS}Component${ZWS}Name`,
    );
  });

  // -------------------------------------------------------------------------
  // Pass 4 — Structural separators
  // -------------------------------------------------------------------------

  it('Pass 4 — double underscore is a wrap point', () => {
    expect(injectWordBreaks('my__variable')).toBe(`my${ZWS}__${ZWS}variable`);
  });

  it('Pass 4 — single underscore stays within the word group', () => {
    // my_file has one underscore → not split by Pass 4
    expect(injectWordBreaks('my_file')).toBe('my_file');
  });

  it('Pass 4 — triple underscore is a structural separator', () => {
    expect(injectWordBreaks('a___b')).toBe(`a${ZWS}___${ZWS}b`);
  });

  it('Pass 4 — @ is isolated as a separator', () => {
    // Not an email (no domain) → stays as regular groups
    expect(injectWordBreaks('foo@bar')).toBe(`foo${ZWS}@${ZWS}bar`);
  });

  it('Pass 4 — / already isolated by Pass 2, ZWS added around it', () => {
    expect(injectWordBreaks('a/b')).toBe(`a${ZWS}/${ZWS}b`);
  });

  // -------------------------------------------------------------------------
  // Pass 5 — Punctuation attachment
  // -------------------------------------------------------------------------

  it('Pass 5 — trailing period attaches left', () => {
    expect(injectWordBreaks('foo.bar')).toBe(`foo.${ZWS}bar`);
  });

  it('Pass 5 — trailing semicolon attaches left', () => {
    expect(injectWordBreaks('foo;bar')).toBe(`foo;${ZWS}bar`);
  });

  it('Pass 5 — trailing colon attaches left', () => {
    expect(injectWordBreaks('key:value')).toBe(`key:${ZWS}value`);
  });

  it('Pass 5 — closing paren attaches left', () => {
    expect(injectWordBreaks('hello)world')).toBe(`hello)${ZWS}world`);
  });

  it('Pass 5 — closing bracket attaches left', () => {
    expect(injectWordBreaks('a]b')).toBe(`a]${ZWS}b`);
  });

  it('Pass 5 — closing brace attaches left', () => {
    expect(injectWordBreaks('a}b')).toBe(`a}${ZWS}b`);
  });

  it('Pass 5 — opening paren attaches right', () => {
    expect(injectWordBreaks('foo(bar')).toBe(`foo${ZWS}(bar`);
  });

  it('Pass 5 — opening bracket attaches right', () => {
    expect(injectWordBreaks('a[b')).toBe(`a${ZWS}[b`);
  });

  it('Pass 5 — opening brace attaches right', () => {
    expect(injectWordBreaks('a{b')).toBe(`a${ZWS}{b`);
  });

  it('Pass 5 — trailing punct with whitespace in same token: group not split, no attachment', () => {
    // "hello ," → Pass 2 groups " ," as one non-word token (not a bare comma)
    // so no punctuation attachment occurs
    const result = injectWordBreaks('hello ,');
    expect(stripZWS(result)).toBe('hello ,');
    expect(result).not.toContain('hello,');
  });

  it('Pass 5 — leading punct with whitespace in same token: no attachment', () => {
    // "( world" → Pass 2 groups "( " as one non-word token
    const result = injectWordBreaks('( world');
    expect(stripZWS(result)).toBe('( world');
    expect(result).not.toContain('(world');
  });

  it('Pass 5 — trailing punct at start with no left neighbour stays alone', () => {
    // Comma at position 0 has nothing to attach to on the left
    const result = injectWordBreaks(',hello');
    expect(stripZWS(result)).toBe(',hello');
  });

  it('Pass 5 — leading punct at end with no right neighbour stays alone', () => {
    const result = injectWordBreaks('hello(');
    expect(stripZWS(result)).toBe('hello(');
  });

  it('Pass 5 — matching parens around a word: ( attaches right, ) attaches left', () => {
    expect(injectWordBreaks('(hello)world')).toBe(`(hello)${ZWS}world`);
  });

  // -------------------------------------------------------------------------
  // ZWS insertion rule — whitespace prevents ZWS
  // -------------------------------------------------------------------------

  it('ZWS not inserted between tokens separated by whitespace', () => {
    expect(injectWordBreaks('foo bar baz')).toBe('foo bar baz');
  });

  it('ZWS not inserted around whitespace even when surrounded by non-whitespace', () => {
    expect(injectWordBreaks('a b')).toBe('a b');
  });

  // -------------------------------------------------------------------------
  // Invariant: visible text never changes
  // -------------------------------------------------------------------------

  it('visible text is preserved for spec Example 1', () => {
    expect(stripZWS(injectWordBreaks('-0.1%'))).toBe('-0.1%');
  });

  it('visible text is preserved for spec Example 2', () => {
    expect(stripZWS(injectWordBreaks('foo,bar'))).toBe('foo,bar');
  });

  it('visible text is preserved for spec Example 3', () => {
    expect(stripZWS(injectWordBreaks('getUserProfileData'))).toBe('getUserProfileData');
  });

  it('visible text is preserved for spec Example 4', () => {
    expect(stripZWS(injectWordBreaks('path/to/my_file'))).toBe('path/to/my_file');
  });

  it('visible text is preserved for spec Example 5', () => {
    expect(stripZWS(injectWordBreaks('Δ=-2.4E+6,avg'))).toBe('Δ=-2.4E+6,avg');
  });

  // -------------------------------------------------------------------------
  // Security edge cases
  // -------------------------------------------------------------------------

  describe('security edge cases', () => {
    it('handles XSS payload without throwing', () => {
      const result = injectWordBreaks('<script>alert(1)</script>');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      // The visible text must be unchanged
      expect(stripZWS(result)).toBe('<script>alert(1)</script>');
    });

    it('handles HTML injection payload', () => {
      const result = injectWordBreaks('<img onerror="alert(1)" src=x>');
      expect(result).toBeDefined();
      expect(stripZWS(result)).toBe('<img onerror="alert(1)" src=x>');
    });

    it('handles extremely long input without hanging', () => {
      const long = 'word,'.repeat(5_000);
      const result = injectWordBreaks(long);
      expect(stripZWS(result)).toBe(long);
    });

    it('handles null bytes in input', () => {
      const result = injectWordBreaks('hello\0world');
      expect(result).toBeDefined();
      expect(stripZWS(result)).toBe('hello\0world');
    });

    it('input already containing ZWS has its visible content preserved', () => {
      const input = `foo${ZWS}bar`;
      const result = injectWordBreaks(input);
      expect(stripZWS(result)).toBe('foobar');
    });

    it('handles string with only special characters', () => {
      const result = injectWordBreaks('!@#$%^&*()');
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('handles ReDoS-prone patterns gracefully', () => {
      // Very long string of commas followed by a digit — exercises the atomic regex
      const tricky = ','.repeat(100) + '1';
      const result = injectWordBreaks(tricky);
      expect(stripZWS(result)).toBe(tricky);
    });
  });
});
