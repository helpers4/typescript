/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Loads a font and registers it in `document.fonts`, so CSS and canvas can use `family` right
 * away.
 *
 * `source` is either a URL (wrapped in `url()` for you) or the font file's bytes. Outside a
 * browser (no `FontFace`), it rejects with a `TypeError`.
 *
 * @param family - The family name CSS will use, e.g. `'Inter'`
 * @param source - The font URL, or its bytes
 * @param descriptors - `weight`, `style`, `unicodeRange`, ... as in a CSS `@font-face` rule
 * @returns The loaded `FontFace`
 * @throws {DOMException} (as a rejection) If the font cannot be loaded or parsed
 * @example
 * await loadFont('Inter', '/fonts/Inter-Bold.woff2', { weight: '700' });
 * @example
 * await loadFont('Embedded', await file.arrayBuffer());
 * @since 3.1.5
 */
export async function loadFont(
  family: string,
  source: string | BufferSource,
  descriptors?: FontFaceDescriptors,
): Promise<FontFace> {
  if (typeof globalThis.FontFace !== 'function') throw new TypeError('loadFont needs a browser (no FontFace constructor)');
  const face = new globalThis.FontFace(family, typeof source === 'string' ? `url(${JSON.stringify(source)})` : source, descriptors);
  await face.load();
  globalThis.document.fonts.add(face);
  return face;
}
