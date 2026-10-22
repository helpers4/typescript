/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { stripHtml } from './stripHtml';

describe('stripHtml', () => {
  it('removes tags and keeps inline text together', () => {
    expect(stripHtml('<p>Hello <b>wor</b>ld</p>')).toBe('Hello world');
  });

  it('turns block tags and br into a space', () => {
    expect(stripHtml('<p>a</p><p>b</p>')).toBe('a b');
    expect(stripHtml('a<br/>b')).toBe('a b');
    expect(stripHtml('<ul><li>one</li><li>two</li></ul>')).toBe('one two');
  });

  it('decodes named, decimal and hex entities', () => {
    expect(stripHtml('y&nbsp;z')).toBe('y z');
    expect(stripHtml('&amp; &lt; &gt; &quot; &apos; &#39; &#x27; &hellip;')).toBe('& < > " \' \' \' …');
    expect(stripHtml('&#128512; &#x1F600;')).toBe('😀 😀');
  });

  it('decodes once, so an escaped tag is text and not stripped', () => {
    expect(stripHtml('&lt;b&gt;x&lt;/b&gt;')).toBe('<b>x</b>');
    expect(stripHtml('&amp;lt;')).toBe('&lt;');
  });

  it('leaves unknown and invalid entities as written', () => {
    expect(stripHtml('&unknown; &#xD800; &#1114112;')).toBe('&unknown; &#xD800; &#1114112;');
  });

  it('drops comments, scripts and styles with their content', () => {
    expect(stripHtml('a<!-- hidden -->b<script>alert(1)</script>c<style>p{}</style>d')).toBe('abcd');
    expect(stripHtml('x<SCRIPT type="text/javascript">1</SCRIPT >y')).toBe('xy');
  });

  it('handles tag attributes containing quotes', () => {
    expect(stripHtml('<a href="x" title=\'y\'>link</a>')).toBe('link');
  });

  it('does not eat a bare less-than sign', () => {
    expect(stripHtml('1 < 2 and 3 > 2')).toBe('1 < 2 and 3 > 2');
  });

  it('collapses whitespace and trims', () => {
    expect(stripHtml('  a \n\t b  ')).toBe('a b');
  });

  it('returns an empty string for empty input', () => {
    expect(stripHtml('')).toBe('');
    expect(stripHtml('<div></div>')).toBe('');
  });

  it('strips markup rebuilt by removing a nested tag', () => {
    expect(stripHtml('<scr<script></script>ipt>alert(1)')).toBe('alert(1)');
    expect(stripHtml('<<b>b>x')).toBe('x');
    expect(stripHtml('<!<!-- -->-- a -->b')).toBe('b');
    expect(stripHtml('<scr<b></b>ipt>x')).not.toContain('<script');
  });
});
