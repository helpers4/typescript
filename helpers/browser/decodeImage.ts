/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Loads an image and waits until it is decoded, so it can be painted without a flash or a
 * decoding pause (e.g. before swapping screens).
 *
 * Outside a browser (no `Image`), it rejects with a `TypeError`.
 *
 * @param src - The image URL
 * @returns The decoded image element
 * @throws {EncodingError} (as a rejection) If the image cannot be loaded or decoded
 * @example
 * const image = await decodeImage('/screens/home.png');
 * container.replaceChildren(image);
 * @since 3.1.5
 */
export async function decodeImage(src: string): Promise<HTMLImageElement> {
  if (typeof globalThis.Image !== 'function') throw new TypeError('decodeImage needs a browser (no Image constructor)');
  const image = new globalThis.Image();
  image.src = src;
  await image.decode();
  return image;
}
