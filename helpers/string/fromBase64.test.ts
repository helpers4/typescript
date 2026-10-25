/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { fromBase64 } from './fromBase64';

describe('fromBase64', () => {
  it('decodes the RFC 4648 test vectors', () => {
    expect(fromBase64('')).toBe('');
    expect(fromBase64('Zg==')).toBe('f');
    expect(fromBase64('Zm8=')).toBe('fo');
    expect(fromBase64('Zm9vYmFy')).toBe('foobar');
  });

  it('decodes UTF-8 text', () => {
    expect(fromBase64('aMOpbGxv')).toBe('héllo');
    expect(fromBase64('8J+YgA==')).toBe('😀');
  });

  it('accepts missing padding and both alphabets', () => {
    expect(fromBase64('Zg')).toBe('f');
    expect(Array.from(fromBase64('-_8', { output: 'bytes' }))).toEqual([251, 255]);
    expect(Array.from(fromBase64('+/8=', { output: 'bytes' }))).toEqual([251, 255]);
  });

  it('can return the bytes, and the string output is explicit-able', () => {
    expect(fromBase64('Zg==', { output: 'bytes' })).toBeInstanceOf(Uint8Array);
    expect(fromBase64('Zg==', { output: 'string' })).toBe('f');
  });

  it('throws a SyntaxError on invalid input', () => {
    expect(() => fromBase64('Z')).toThrow(SyntaxError);
    expect(() => fromBase64('Zg=')).toThrow(SyntaxError);
    expect(() => fromBase64('Zg===')).toThrow(SyntaxError);
    expect(() => fromBase64('Zm9v!')).toThrow(SyntaxError);
    expect(() => fromBase64('Zm 9v')).toThrow(SyntaxError);
  });

  it('throws a TypeError when the bytes are not UTF-8 and a string was asked for', () => {
    expect(() => fromBase64('/w==')).toThrow(TypeError);
    expect(fromBase64('/w==', { output: 'bytes' })).toEqual(new Uint8Array([255]));
  });
});
