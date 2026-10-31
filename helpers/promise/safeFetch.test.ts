/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { safeFetch } from './safeFetch';

describe('safeFetch (deprecated alias of @helpers4/fetch)', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('returns the parsed JSON body', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ stars: 3 })));
    expect(await safeFetch<{ stars: number }>('https://example.com')).toEqual({ stars: 3 });
  });

  it('forwards the parse option', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('plain')));
    expect(await safeFetch<string>('https://example.com', undefined, { parse: 'text' })).toBe('plain');
  });

  it('returns null on a failed request', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 500 })));
    expect(await safeFetch('https://example.com')).toBeNull();
  });
});
