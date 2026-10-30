/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

const startsWith = (bytes: Uint8Array, signature: readonly number[], offset = 0): boolean =>
  bytes.length >= offset + signature.length && signature.every((byte, i) => bytes[offset + i] === byte);

const ascii = (text: string): number[] => Array.from(text, (c) => c.charCodeAt(0));

/**
 * Finds the media type of an image from its first bytes (its magic number), whatever its name
 * says: PNG, JPEG, GIF, WebP, AVIF and SVG. SVG has no magic number, so it is recognized as text
 * whose first element is `<svg`, possibly after a byte order mark, whitespace, an XML
 * declaration, comments or a doctype.
 *
 * @param bytes - The start of the file: 512 bytes are enough for every type but a long SVG prolog
 * @returns The media type (`'image/png'`, ...), or `undefined` when it is none of these
 * @example
 * mediaTypeOf(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) // => 'image/png'
 * @since 3.1.10
 */
export function mediaTypeOf(bytes: Uint8Array): string | undefined {
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'image/png';
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return 'image/jpeg';
  if (startsWith(bytes, ascii('GIF87a')) || startsWith(bytes, ascii('GIF89a'))) return 'image/gif';
  if (startsWith(bytes, ascii('RIFF')) && startsWith(bytes, ascii('WEBP'), 8)) return 'image/webp';
  if (startsWith(bytes, ascii('ftyp'), 4) && (startsWith(bytes, ascii('avif'), 8) || startsWith(bytes, ascii('avis'), 8))) {
    return 'image/avif';
  }
  const head = new TextDecoder('latin1').decode(bytes.subarray(0, 2048)).replace(/^\u00ef\u00bb\u00bf/, '');
  const prolog = head.replace(/^(?:\s+|<\?xml[\s\S]*?\?>|<!--[\s\S]*?-->|<!DOCTYPE[^>]*>)+/i, '');
  return /^<svg[\s>/]/i.test(prolog) ? 'image/svg+xml' : undefined;
}
