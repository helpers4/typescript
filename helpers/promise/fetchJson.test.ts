/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchJson } from './fetchJson';

describe('fetchJson (deprecated alias of @helpers4/fetch)', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('returns the parsed JSON body', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ stars: 3 })));
    expect(await fetchJson<{ stars: number }>('https://example.com')).toEqual({ stars: 3 });
  });

  it('forwards the retry options', async () => {
    const calls = vi.fn(async () => new Response('down', { status: 503 }));
    vi.stubGlobal('fetch', calls);
    await expect(
      fetchJson('https://example.com', undefined, { retry: { attempts: 2, delayMs: 0 } }),
    ).rejects.toThrow('HTTP 503');
    expect(calls).toHaveBeenCalledTimes(2);
  });
});
