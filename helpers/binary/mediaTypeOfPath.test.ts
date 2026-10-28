/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { mediaTypeOfPath } from './mediaTypeOfPath';

describe('mediaTypeOfPath', () => {
  it('finds the type from the extension', () => {
    expect(mediaTypeOfPath('layers/a@2x.webp')).toBe('image/webp');
    expect(mediaTypeOfPath('a.svg')).toBe('image/svg+xml');
    expect(mediaTypeOfPath('dir.v2/app.js')).toBe('text/javascript');
  });

  it('ignores case, the query string and the fragment', () => {
    expect(mediaTypeOfPath('/fonts/Inter.WOFF2?v=3')).toBe('font/woff2');
    expect(mediaTypeOfPath('https://x.dev/a.png#top')).toBe('image/png');
  });

  it('reads Windows separators', () => {
    expect(mediaTypeOfPath('C:\\art\\a.jpeg')).toBe('image/jpeg');
  });

  it('gives undefined without a known extension', () => {
    expect(mediaTypeOfPath('LICENSE')).toBeUndefined();
    expect(mediaTypeOfPath('a.unknown')).toBeUndefined();
    expect(mediaTypeOfPath('dir.png/file')).toBeUndefined();
    expect(mediaTypeOfPath('')).toBeUndefined();
  });

  it('does not read Object.prototype keys as extensions', () => {
    expect(mediaTypeOfPath('a.constructor')).toBeUndefined();
  });
});
