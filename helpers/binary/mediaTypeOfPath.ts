/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

const TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  avif: 'image/avif',
  svg: 'image/svg+xml',
  ico: 'image/x-icon',
  bmp: 'image/bmp',
  woff: 'font/woff',
  woff2: 'font/woff2',
  ttf: 'font/ttf',
  otf: 'font/otf',
  html: 'text/html',
  htm: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  mjs: 'text/javascript',
  json: 'application/json',
  txt: 'text/plain',
  md: 'text/markdown',
  xml: 'application/xml',
  wasm: 'application/wasm',
  pdf: 'application/pdf',
  zip: 'application/zip',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  mp4: 'video/mp4',
  webm: 'video/webm',
};

/**
 * Finds the media type of a file from the extension of its path or URL: images, fonts, web
 * documents, scripts and styles, data, audio and video. Case is ignored, and a query string or
 * fragment after the path is skipped. Pass it where a server or a `Blob` needs a `Content-Type`.
 *
 * @param path - A file path or URL
 * @returns The media type (`'image/webp'`, ...), or `undefined` for an unknown or missing extension
 * @example
 * mediaTypeOfPath('layers/a@2x.webp') // => 'image/webp'
 * mediaTypeOfPath('/fonts/Inter.WOFF2?v=3') // => 'font/woff2'
 * @since next
 */
export function mediaTypeOfPath(path: string): string | undefined {
  const name = path.split(/[?#]/, 1)[0]!.split(/[\\/]/).pop()!;
  const dot = name.lastIndexOf('.');
  const extension = name.slice(dot + 1).toLowerCase();
  return dot >= 0 && Object.hasOwn(TYPES, extension) ? TYPES[extension] : undefined;
}
