/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpError, fetchOrThrow } from './fetchOrThrow';

function mockFetch(response: Partial<Response> | Error) {
  const fn = response instanceof Error
    ? vi.fn().mockRejectedValue(response)
    : vi.fn().mockResolvedValue(response);
  vi.stubGlobal('fetch', fn);
  return fn;
}

describe('fetchOrThrow', () => {
  beforeEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it('resolves with the response on 2xx', async () => {
    const response = { ok: true, status: 200 } as Response;
    mockFetch(response);
    await expect(fetchOrThrow('https://example.com/api')).resolves.toBe(response);
  });

  it('passes input and init through to fetch', async () => {
    const fn = mockFetch({ ok: true } as Response);
    const init = { method: 'POST' };
    await fetchOrThrow('https://example.com/api', init);
    expect(fn).toHaveBeenCalledWith('https://example.com/api', init);
  });

  it('rejects with an HttpError on a non-2xx status', async () => {
    const response = { ok: false, status: 404, statusText: 'Not Found', url: '' } as Response;
    mockFetch(response);
    const error = await fetchOrThrow('https://example.com/missing').catch((e: unknown) => e);

    expect(error).toBeInstanceOf(HttpError);
    expect(error).toBeInstanceOf(Error);
    const httpError = error as HttpError;
    expect(httpError.name).toBe('HttpError');
    expect(httpError.message).toBe('HTTP 404 Not Found: https://example.com/missing');
    expect(httpError.status).toBe(404);
    expect(httpError.statusText).toBe('Not Found');
    expect(httpError.url).toBe('https://example.com/missing');
    expect(httpError.response).toBe(response);
  });

  it('leaves the status text out of the message when it is empty', async () => {
    mockFetch({ ok: false, status: 500, statusText: '', url: '' } as Response);
    await expect(fetchOrThrow('https://example.com')).rejects.toThrow('HTTP 500: https://example.com');
  });

  it('prefers the final URL of the response, after redirects', async () => {
    mockFetch({ ok: false, status: 410, statusText: 'Gone', url: 'https://example.com/new' } as Response);
    const error = (await fetchOrThrow('https://example.com/old').catch((e: unknown) => e)) as HttpError;
    expect(error.url).toBe('https://example.com/new');
  });

  it('reads the URL from a URL object', async () => {
    mockFetch({ ok: false, status: 403, statusText: 'Forbidden', url: '' } as Response);
    const error = (await fetchOrThrow(new URL('https://example.com/a?b=1')).catch((e: unknown) => e)) as HttpError;
    expect(error.url).toBe('https://example.com/a?b=1');
  });

  it('reads the URL from a Request object', async () => {
    mockFetch({ ok: false, status: 401, statusText: 'Unauthorized', url: '' } as Response);
    const error = (await fetchOrThrow(new Request('https://example.com/r')).catch((e: unknown) => e)) as HttpError;
    expect(error.url).toBe('https://example.com/r');
  });

  it('lets network errors through unchanged', async () => {
    const networkError = new TypeError('fetch failed');
    mockFetch(networkError);
    await expect(fetchOrThrow('https://example.com')).rejects.toBe(networkError);
  });
});
