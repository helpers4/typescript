/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { template } from './template';

describe('template', () => {
  it('replaces a single placeholder', () => {
    expect(template('Hello, {{name}}!', { name: 'Alice' })).toBe('Hello, Alice!');
  });

  it('replaces multiple placeholders', () => {
    expect(
      template('{{greeting}}, {{name}}! You have {{count}} messages.', {
        greeting: 'Hi',
        name: 'Bob',
        count: 3,
      }),
    ).toBe('Hi, Bob! You have 3 messages.');
  });

  it('replaces the same placeholder multiple times', () => {
    expect(template('{{x}} + {{x}} = ?', { x: 2 })).toBe('2 + 2 = ?');
  });

  it('replaces unknown keys with empty string', () => {
    expect(template('Hello, {{name}}!', {})).toBe('Hello, !');
  });

  it('returns the string unchanged when there are no placeholders', () => {
    expect(template('no placeholders here', { name: 'Alice' })).toBe('no placeholders here');
  });

  it('returns empty string for empty input', () => {
    expect(template('', { name: 'Alice' })).toBe('');
  });

  it('handles whitespace around key name: {{ key }}', () => {
    expect(template('{{ name }}', { name: 'Alice' })).toBe('Alice');
  });

  it('converts non-string values to string', () => {
    expect(template('count: {{n}}', { n: 42 })).toBe('count: 42');
    expect(template('flag: {{b}}', { b: true })).toBe('flag: true');
  });

  it('does not evaluate expressions — unmatched placeholders stay as-is', () => {
    // {{a + b}} contains non-word chars, so it does not match \w+ and is left unchanged
    expect(template('{{a + b}}', { 'a + b': 'nope' })).toBe('{{a + b}}');
  });

  it('handles data with undefined values as empty string', () => {
    expect(template('value: {{x}}', { x: undefined })).toBe('value: ');
  });

  it('handles data with null values as empty string', () => {
    expect(template('value: {{x}}', { x: null })).toBe('value: ');
  });
});
