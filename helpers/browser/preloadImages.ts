/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { mapAsync } from '../array/mapAsync';
import { decodeImage } from './decodeImage';

/**
 * Options for {@link preloadImages}.
 * @since next
 */
export interface PreloadImagesOptions {
  /** Maximum number of images loaded at the same time. Defaults to `6`. */
  concurrency?: number;
}

/**
 * Loads and decodes several images with {@link decodeImage}, a few at a time.
 *
 * It never rejects: an image that fails does not stop the others, and its result says why.
 *
 * @param urls - The image URLs
 * @param options - Concurrency — see {@link PreloadImagesOptions}
 * @returns One result per URL, in the same order
 * @example
 * const results = await preloadImages(['/a.png', '/b.png']);
 * const failed = results.filter((result) => result.status === 'rejected');
 * @since next
 */
export async function preloadImages(
  urls: readonly string[],
  options: PreloadImagesOptions = {},
): Promise<PromiseSettledResult<HTMLImageElement>[]> {
  const { concurrency = 6 } = options;
  return mapAsync(
    urls,
    (url): Promise<PromiseSettledResult<HTMLImageElement>> =>
      decodeImage(url).then(
        (value) => ({ status: 'fulfilled', value }),
        (reason: unknown) => ({ status: 'rejected', reason }),
      ),
    concurrency,
  );
}
