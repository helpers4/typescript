/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HttpError } from './fetchOrThrow';
import { fetchJson } from './fetchJson';

afterEach(() => { vi.unstubAllGlobals(); });

const response = (code: number, body: unknown = null) =>
  ({ ok: code >= 200 && code < 300, status: code, statusText: '', url: 'https://example.com', json: () => Promise.resolve(body) }) as Response;

describe('fetchJson — property-based', () => {
  it('returns any JSON body unchanged', async () => {
    await fc.assert(fc.asyncProperty(fc.jsonValue(), async (body) => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response(200, body)));
      expect(await fetchJson('https://example.com')).toEqual(body);
    }));
  });

  it('retries exactly the transient statuses', async () => {
    await fc.assert(fc.asyncProperty(fc.integer({ min: 300, max: 599 }), async (code) => {
      const fn = vi.fn().mockResolvedValue(response(code));
      vi.stubGlobal('fetch', fn);
      const error = await fetchJson('https://example.com', undefined, { retry: { attempts: 2, delayMs: 0 } }).catch((e: unknown) => e);
      expect(error).toBeInstanceOf(HttpError);
      expect(fn).toHaveBeenCalledTimes(code >= 500 || code === 429 ? 2 : 1);
    }), { numRuns: 60 });
  });
});

describe('fetchJson — contract', () => {
  it('carries the status and url on the thrown error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response(404)));
    const error = await fetchJson('https://example.com').catch((e: unknown) => e) as HttpError;
    expect([error.status, error.url]).toEqual([404, 'https://example.com']);
  });
});
