/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpError } from './fetchOrThrow';
import { fetchJson } from './fetchJson';

const ok = (body: unknown) => ({ ok: true, status: 200, json: () => Promise.resolve(body) }) as Response;
const status = (code: number) => ({ ok: false, status: code, statusText: '', url: 'https://example.com/api' }) as Response;
const fast = { retry: { delayMs: 0 } };

describe('fetchJson', () => {
  beforeEach(() => { vi.unstubAllGlobals(); });
  afterEach(() => { vi.unstubAllGlobals(); });

  it('returns the parsed body', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok({ a: 1 })));
    await expect(fetchJson('https://example.com/api')).resolves.toEqual({ a: 1 });
  });

  it('passes input and init through to fetch', async () => {
    const fn = vi.fn().mockResolvedValue(ok({}));
    vi.stubGlobal('fetch', fn);
    const init = { headers: { accept: 'application/json' } };
    await fetchJson('https://example.com/api', init);
    expect(fn).toHaveBeenCalledWith('https://example.com/api', init);
  });

  it('retries a network error', async () => {
    const fn = vi.fn().mockRejectedValueOnce(new TypeError('fetch failed')).mockResolvedValue(ok({ a: 1 }));
    vi.stubGlobal('fetch', fn);
    await expect(fetchJson('https://example.com/api', undefined, fast)).resolves.toEqual({ a: 1 });
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it.each([500, 503, 429])('retries a %i response', async (code) => {
    const fn = vi.fn().mockResolvedValueOnce(status(code)).mockResolvedValue(ok({ a: 1 }));
    vi.stubGlobal('fetch', fn);
    await expect(fetchJson('https://example.com/api', undefined, fast)).resolves.toEqual({ a: 1 });
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it.each([400, 401, 404])('does not retry a %i response', async (code) => {
    const fn = vi.fn().mockResolvedValue(status(code));
    vi.stubGlobal('fetch', fn);
    const error = await fetchJson('https://example.com/api', undefined, fast).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(HttpError);
    expect((error as HttpError).status).toBe(code);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('throws the HttpError of the last attempt', async () => {
    const fn = vi.fn().mockResolvedValue(status(503));
    vi.stubGlobal('fetch', fn);
    const error = await fetchJson('https://example.com/api', undefined, { retry: { attempts: 2, delayMs: 0 } }).catch((e: unknown) => e);
    expect((error as HttpError).status).toBe(503);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('does not retry a body that is not valid JSON', async () => {
    const fn = vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.reject(new SyntaxError('bad json')) });
    vi.stubGlobal('fetch', fn);
    await expect(fetchJson('https://example.com/api', undefined, fast)).rejects.toThrow(SyntaxError);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does not retry an aborted request', async () => {
    const abort = Object.assign(new Error('aborted'), { name: 'AbortError' });
    const fn = vi.fn().mockRejectedValue(abort);
    vi.stubGlobal('fetch', fn);
    await expect(fetchJson('https://example.com/api', undefined, fast)).rejects.toBe(abort);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries a rejection that is not an Error', async () => {
    const fn = vi.fn().mockRejectedValueOnce('boom').mockResolvedValue(ok(1));
    vi.stubGlobal('fetch', fn);
    await expect(fetchJson('https://example.com/api', undefined, fast)).resolves.toBe(1);
  });

  it('honors the attempts option', async () => {
    const fn = vi.fn().mockRejectedValue(new TypeError('down'));
    vi.stubGlobal('fetch', fn);
    await expect(fetchJson('https://example.com/api', undefined, { retry: { attempts: 4, delayMs: 0 } })).rejects.toThrow('down');
    expect(fn).toHaveBeenCalledTimes(4);
  });

  it('lets a custom shouldRetry replace the default rule', async () => {
    const fn = vi.fn().mockResolvedValueOnce(status(404)).mockResolvedValue(ok({ a: 1 }));
    vi.stubGlobal('fetch', fn);
    await expect(fetchJson('https://example.com/api', undefined, {
      retry: { delayMs: 0, shouldRetry: (error) => error instanceof HttpError && error.status === 404 },
    })).resolves.toEqual({ a: 1 });
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
