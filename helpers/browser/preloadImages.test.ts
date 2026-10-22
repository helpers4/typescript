/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { preloadImages } from './preloadImages';

let active = 0;
let peak = 0;

class FakeImage {
  src = '';
  async decode() {
    active++;
    peak = Math.max(peak, active);
    await new Promise((resolve) => setTimeout(resolve, 1));
    active--;
    if (this.src.includes('broken')) throw new Error('broken');
  }
}

describe('preloadImages', () => {
  afterEach(() => { vi.unstubAllGlobals(); active = 0; peak = 0; });

  it('returns one settled result per URL, in order', async () => {
    vi.stubGlobal('Image', FakeImage);
    const results = await preloadImages(['/a.png', '/broken.png', '/c.png']);
    expect(results.map((result) => result.status)).toEqual(['fulfilled', 'rejected', 'fulfilled']);
    const first = results[0] as PromiseFulfilledResult<HTMLImageElement>;
    expect(first.value.src).toBe('/a.png');
    expect((results[1] as PromiseRejectedResult).reason).toEqual(new Error('broken'));
  });

  it('loads at most 6 images at a time by default, or the given concurrency', async () => {
    vi.stubGlobal('Image', FakeImage);
    const urls = Array.from({ length: 10 }, (_, i) => `/${i}.png`);
    await preloadImages(urls);
    expect(peak).toBe(6);
    peak = 0;
    await preloadImages(urls, { concurrency: 2 });
    expect(peak).toBe(2);
  });

  it('returns an empty array for no URL', async () => {
    await expect(preloadImages([])).resolves.toEqual([]);
  });
});
