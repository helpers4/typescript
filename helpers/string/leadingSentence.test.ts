/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { leadingSentence } from './leadingSentence';

describe('leadingSentence', () => {
  it('extracts sentence ending with period', () => {
    expect(leadingSentence('Hello world. More text here.')).toBe('Hello world.');
  });

  it('extracts sentence ending with question mark', () => {
    expect(leadingSentence('Is it working? Yes it is!')).toBe('Is it working?');
  });

  it('extracts sentence ending with exclamation mark', () => {
    expect(leadingSentence('Hello! World.')).toBe('Hello!');
  });

  it('extracts sentence ending with semicolon', () => {
    expect(leadingSentence('First clause; second clause.')).toBe('First clause;');
  });

  it('extracts sentence ending with ellipsis character', () => {
    expect(leadingSentence('Wait\u2026 then act.')).toBe('Wait\u2026');
  });

  it('returns full string when no terminator found', () => {
    expect(leadingSentence('No terminator here')).toBe('No terminator here');
  });

  it('collapses newlines before matching', () => {
    expect(leadingSentence('Hello\nworld. More.')).toBe('Hello world.');
  });

  it('trims leading and trailing whitespace', () => {
    expect(leadingSentence('  Hello.  ')).toBe('Hello.');
  });

  it('handles period at end of string', () => {
    expect(leadingSentence('Only one sentence.')).toBe('Only one sentence.');
  });

  it('returns empty string for empty input', () => {
    expect(leadingSentence('')).toBe('');
  });

  it('returns null for null', () => {
    expect(leadingSentence(null)).toBeNull();
  });

  it('returns undefined for undefined', () => {
    expect(leadingSentence(undefined)).toBeUndefined();
  });
});
