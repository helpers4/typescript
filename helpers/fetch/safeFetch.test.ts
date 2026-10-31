/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { safeFetch } from './safeFetch';

function mockFetch(response: Partial<Response> | Error): void {
  vi.stubGlobal('fetch', typeof response === 'object' && response instanceof Error
    ? vi.fn().mockRejectedValue(response)
    : vi.fn().mockResolvedValue(response)
  );
}

describe('safeFetch', () => {
  beforeEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it('returns parsed JSON on 200 OK', async () => {
    const payload = { stars: 42 };
    mockFetch({
      ok: true,
      json: vi.fn().mockResolvedValue(payload),
    } as unknown as Response);

    const result = await safeFetch<{ stars: number }>('https://example.com/api');
    expect(result).toEqual(payload);
  });

  it('returns null on non-OK status', async () => {
    mockFetch({ ok: false } as Response);
    const result = await safeFetch('https://example.com/api');
    expect(result).toBeNull();
  });

  it('returns null on network error', async () => {
    mockFetch(new Error('Network error'));
    const result = await safeFetch('https://example.com/api');
    expect(result).toBeNull();
  });

  it('returns null when JSON parse fails', async () => {
    mockFetch({
      ok: true,
      json: vi.fn().mockRejectedValue(new SyntaxError('bad json')),
    } as unknown as Response);
    const result = await safeFetch('https://example.com/api');
    expect(result).toBeNull();
  });

  it('parses text when parse option is "text"', async () => {
    mockFetch({
      ok: true,
      text: vi.fn().mockResolvedValue('hello'),
    } as unknown as Response);
    const result = await safeFetch<string>('https://example.com/api', undefined, { parse: 'text' });
    expect(result).toBe('hello');
  });

  it('returns null when text parse fails', async () => {
    mockFetch({
      ok: true,
      text: vi.fn().mockRejectedValue(new Error('stream error')),
    } as unknown as Response);
    const result = await safeFetch('https://example.com/api', undefined, { parse: 'text' });
    expect(result).toBeNull();
  });

  it('passes init options to fetch', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: vi.fn().mockResolvedValue(null) });
    vi.stubGlobal('fetch', fetchMock);
    const init: RequestInit = { method: 'POST', headers: { 'Content-Type': 'application/json' } };
    await safeFetch('https://example.com/api', init);
    expect(fetchMock).toHaveBeenCalledWith('https://example.com/api', init);
  });
});
