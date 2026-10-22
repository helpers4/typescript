/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { loadFont } from './loadFont';

class FakeFontFace {
  static fail = false;
  constructor(public family: string, public source: unknown, public descriptors?: FontFaceDescriptors) {}
  load() { return FakeFontFace.fail ? Promise.reject(new Error('bad font')) : Promise.resolve(this); }
}

function stubFonts() {
  const add = vi.fn();
  Object.defineProperty(document, 'fonts', { value: { add }, configurable: true });
  return add;
}

describe('loadFont', () => {
  afterEach(() => { vi.unstubAllGlobals(); FakeFontFace.fail = false; });

  it('loads a font from a URL and registers it', async () => {
    vi.stubGlobal('FontFace', FakeFontFace);
    const add = stubFonts();
    const face = (await loadFont('Inter', '/fonts/a "b".woff2', { weight: '700' })) as unknown as FakeFontFace;
    expect(face.source).toBe('url("/fonts/a \\"b\\".woff2")');
    expect(face.descriptors).toEqual({ weight: '700' });
    expect(add).toHaveBeenCalledWith(face);
  });

  it('passes bytes as they are', async () => {
    vi.stubGlobal('FontFace', FakeFontFace);
    stubFonts();
    const bytes = new ArrayBuffer(4);
    const face = (await loadFont('Embedded', bytes)) as unknown as FakeFontFace;
    expect(face.source).toBe(bytes);
  });

  it('rejects when the font cannot be loaded, without registering it', async () => {
    vi.stubGlobal('FontFace', FakeFontFace);
    FakeFontFace.fail = true;
    const add = stubFonts();
    await expect(loadFont('Broken', '/x.woff2')).rejects.toThrow('bad font');
    expect(add).not.toHaveBeenCalled();
  });

  it('rejects with a TypeError outside a browser', async () => {
    vi.stubGlobal('FontFace', undefined);
    await expect(loadFont('Inter', '/a.woff2')).rejects.toBeInstanceOf(TypeError);
  });
});
