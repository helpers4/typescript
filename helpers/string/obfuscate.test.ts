/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { deobfuscate } from './deobfuscate';
import { obfuscate } from './obfuscate';

describe('obfuscate', () => {
  it('reverses the text and writes it as base64url', () => {
    expect(obfuscate('me@example.com')).toBe('bW9jLmVscG1heGVAZW0');
    expect(obfuscate('ab')).toBe('YmE');
  });

  it('does not leave the text readable', () => {
    expect(obfuscate('contact@example.com')).not.toContain('example');
    expect(atob(obfuscate('abc'))).not.toBe('abc');
  });

  it('handles the empty string', () => {
    expect(obfuscate('')).toBe('');
  });

  it('uses only the unpadded base64url alphabet', () => {
    expect(obfuscate('??>>>')).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('keeps emoji whole when reversing', () => {
    expect(deobfuscate(obfuscate('a😀b'))).toBe('a😀b');
  });
});
