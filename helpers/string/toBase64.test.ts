/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { toBase64 } from './toBase64';

describe('toBase64', () => {
  it('matches the RFC 4648 test vectors', () => {
    expect(toBase64('')).toBe('');
    expect(toBase64('f')).toBe('Zg==');
    expect(toBase64('fo')).toBe('Zm8=');
    expect(toBase64('foo')).toBe('Zm9v');
    expect(toBase64('foob')).toBe('Zm9vYg==');
    expect(toBase64('fooba')).toBe('Zm9vYmE=');
    expect(toBase64('foobar')).toBe('Zm9vYmFy');
  });

  it('encodes a string as UTF-8', () => {
    expect(toBase64('héllo')).toBe('aMOpbGxv');
    expect(toBase64('😀')).toBe('8J+YgA==');
  });

  it('encodes bytes as they are', () => {
    expect(toBase64(new Uint8Array([251, 255]))).toBe('+/8=');
  });

  it('uses the URL-safe alphabet without padding', () => {
    expect(toBase64(new Uint8Array([251, 255]), { urlSafe: true })).toBe('-_8');
  });

  it('can pad the URL-safe alphabet, or leave the standard one unpadded', () => {
    expect(toBase64(new Uint8Array([251, 255]), { urlSafe: true, padding: true })).toBe('-_8=');
    expect(toBase64('f', { padding: false })).toBe('Zg');
  });
});
