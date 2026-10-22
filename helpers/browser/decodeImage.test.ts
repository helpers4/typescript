/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { decodeImage } from './decodeImage';

function fakeImage(decode: () => Promise<void>) {
  return class { src = ''; decode = decode; };
}

describe('decodeImage', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('resolves with the image once decoded', async () => {
    vi.stubGlobal('Image', fakeImage(() => Promise.resolve()));
    const image = await decodeImage('/a.png');
    expect(image.src).toBe('/a.png');
  });

  it('rejects when decoding fails', async () => {
    vi.stubGlobal('Image', fakeImage(() => Promise.reject(new Error('broken'))));
    await expect(decodeImage('/broken.png')).rejects.toThrow('broken');
  });

  it('rejects with a TypeError outside a browser', async () => {
    vi.stubGlobal('Image', undefined);
    await expect(decodeImage('/a.png')).rejects.toBeInstanceOf(TypeError);
  });
});
