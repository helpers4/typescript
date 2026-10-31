/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpError, fetchOrThrow } from './fetchOrThrow';

describe('fetchOrThrow — property-based', () => {
  beforeEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it('rejects with an HttpError carrying the status for every non-2xx status', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(fc.integer({ min: 100, max: 199 }), fc.integer({ min: 300, max: 599 })),
        fc.string(),
        async (status, statusText) => {
          vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status, statusText, url: '' }));
          const error = await fetchOrThrow('https://example.com').catch((e: unknown) => e);
          expect(error).toBeInstanceOf(HttpError);
          expect((error as HttpError).status).toBe(status);
          expect((error as HttpError).statusText).toBe(statusText);
          expect((error as HttpError).message.startsWith(`HTTP ${status}`)).toBe(true);
        },
      ),
    );
  });

  it('resolves with the same response for every 2xx status', async () => {
    await fc.assert(
      fc.asyncProperty(fc.integer({ min: 200, max: 299 }), async (status) => {
        const response = { ok: true, status };
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
        await expect(fetchOrThrow('https://example.com')).resolves.toBe(response);
      }),
    );
  });

  it('rethrows whatever fetch rejects with', async () => {
    await fc.assert(
      fc.asyncProperty(fc.anything(), async (reason) => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(reason));
        await expect(fetchOrThrow('https://example.com')).rejects.toBe(reason);
      }),
    );
  });
});

describe('fetchOrThrow — contract', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('works with a real Response object', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('nope', { status: 418, statusText: "I'm a teapot" })));
    const error = (await fetchOrThrow('https://example.com/tea').catch((e: unknown) => e)) as HttpError;
    expect(error.message).toBe("HTTP 418 I'm a teapot: https://example.com/tea");
    expect(await error.response.text()).toBe('nope');
  });

  it('leaves the body of a 2xx response unread', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"a":1}', { status: 200 })));
    const response = await fetchOrThrow('https://example.com');
    expect(response.bodyUsed).toBe(false);
    expect(await response.json()).toEqual({ a: 1 });
  });
});
