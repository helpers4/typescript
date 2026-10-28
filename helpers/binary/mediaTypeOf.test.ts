/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { mediaTypeOf } from './mediaTypeOf';

const text = (s: string) => new TextEncoder().encode(s);
const bytes = (...b: number[]) => new Uint8Array(b);
const riff = (tag: string) => text(`RIFF\0\0\0\0${tag}`);
const ftyp = (brand: string) => text(`\0\0\0\x1cftyp${brand}`);

describe('mediaTypeOf', () => {
  it('recognizes the binary formats', () => {
    expect(mediaTypeOf(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0))).toBe('image/png');
    expect(mediaTypeOf(bytes(0xff, 0xd8, 0xff, 0xe0))).toBe('image/jpeg');
    expect(mediaTypeOf(text('GIF87a...'))).toBe('image/gif');
    expect(mediaTypeOf(text('GIF89a...'))).toBe('image/gif');
    expect(mediaTypeOf(riff('WEBPVP8 '))).toBe('image/webp');
    expect(mediaTypeOf(ftyp('avif'))).toBe('image/avif');
    expect(mediaTypeOf(ftyp('avis'))).toBe('image/avif');
  });

  it('does not take another RIFF or ISO file for an image', () => {
    expect(mediaTypeOf(riff('WAVEfmt '))).toBeUndefined();
    expect(mediaTypeOf(ftyp('mp42'))).toBeUndefined();
  });

  it('rejects truncated signatures', () => {
    expect(mediaTypeOf(bytes(0x89, 0x50))).toBeUndefined();
    expect(mediaTypeOf(text('RIFF'))).toBeUndefined();
    expect(mediaTypeOf(new Uint8Array())).toBeUndefined();
  });

  it('recognizes SVG after a prolog', () => {
    expect(mediaTypeOf(text('<svg xmlns="http://www.w3.org/2000/svg"/>'))).toBe('image/svg+xml');
    expect(mediaTypeOf(text('<svg>'))).toBe('image/svg+xml');
    expect(mediaTypeOf(text('\uFEFF  \n<?xml version="1.0"?>\n<!-- made by hand -->\n<!DOCTYPE svg PUBLIC "x" "y">\n<SVG/>'))).toBe('image/svg+xml');
  });

  it('does not take other text or markup for SVG', () => {
    expect(mediaTypeOf(text('<html><svg/></html>'))).toBeUndefined();
    expect(mediaTypeOf(text('<svgx/>'))).toBeUndefined();
    expect(mediaTypeOf(text('hello'))).toBeUndefined();
  });
});
