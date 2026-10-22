/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { escapeHtml } from './escapeHtml';
import { unescapeHtml } from './unescapeHtml';

describe('unescapeHtml', () => {
  it('unescapes all five known entities', () => {
    expect(unescapeHtml('&amp;&lt;&gt;&quot;&#39;')).toBe('&<>"\'');
  });

  it('leaves plain text unchanged', () => {
    expect(unescapeHtml('hello world')).toBe('hello world');
  });

  it('returns an empty string for an empty input', () => {
    expect(unescapeHtml('')).toBe('');
  });

  it('unescapes a full HTML fragment', () => {
    expect(unescapeHtml('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')).toBe(
      '<script>alert("xss")</script>',
    );
  });

  it('leaves unrecognized entities (e.g. &nbsp;) untouched', () => {
    expect(unescapeHtml('a&nbsp;b')).toBe('a&nbsp;b');
  });

  it('round-trips through escapeHtml', () => {
    const original = "It's a <test> & more \"quoted\"";
    expect(unescapeHtml(escapeHtml(original))).toBe(original);
  });
});
