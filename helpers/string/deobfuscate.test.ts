/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { deobfuscate } from './deobfuscate';
import { obfuscate } from './obfuscate';

describe('deobfuscate', () => {
  it('reads what obfuscate wrote', () => {
    expect(deobfuscate('bW9jLmVscG1heGVAZW0')).toBe('me@example.com');
    expect(deobfuscate('')).toBe('');
    expect(deobfuscate(obfuscate('héllo wörld — 日本語'))).toBe('héllo wörld — 日本語');
  });

  it('returns null for a token obfuscate could not have produced', () => {
    expect(deobfuscate('not a token!')).toBeNull();
    expect(deobfuscate('YmE=')).toBeNull();
    expect(deobfuscate('Y')).toBeNull();
    expect(deobfuscate('YmE+')).toBeNull();
    expect(deobfuscate('/w')).toBeNull();
    expect(deobfuscate('_w')).toBeNull();
  });

  it('returns null, not an exception, for anything that is not a string', () => {
    expect(deobfuscate(undefined as unknown as string)).toBeNull();
    expect(deobfuscate(null as unknown as string)).toBeNull();
    expect(deobfuscate(42 as unknown as string)).toBeNull();
  });
});
