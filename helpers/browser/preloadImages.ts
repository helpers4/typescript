/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { mapSettled } from '../array/mapSettled';
import { decodeImage } from './decodeImage';

/**
 * Options for {@link preloadImages}.
 * @since 3.1.5
 */
export interface PreloadImagesOptions {
  /** Maximum number of images loaded at the same time. Defaults to `6`. */
  concurrency?: number;
}

/**
 * Loads and decodes several images with {@link decodeImage}, a few at a time, with
 * `mapSettled` from `helpers4/array`.
 *
 * It never rejects: an image that fails does not stop the others, and its result says why.
 *
 * @param urls - The image URLs
 * @param options - Concurrency — see {@link PreloadImagesOptions}
 * @returns One result per URL, in the same order
 * @example
 * const results = await preloadImages(['/a.png', '/b.png']);
 * const failed = results.filter((result) => result.status === 'rejected');
 * @since 3.1.5
 */
export async function preloadImages(
  urls: readonly string[],
  options: PreloadImagesOptions = {},
): Promise<PromiseSettledResult<HTMLImageElement>[]> {
  const { concurrency = 6 } = options;
  return mapSettled(urls, decodeImage, concurrency);
}
