/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import * as fetchCategory from '../fetch/fetchOrThrow';
import { HttpError, fetchOrThrow } from './fetchOrThrow';

describe('fetchOrThrow (deprecated alias of @helpers4/fetch)', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('returns the response of a 2xx status', async () => {
    const response = new Response('ok');
    vi.stubGlobal('fetch', vi.fn(async () => response));
    expect(await fetchOrThrow('https://example.com')).toBe(response);
  });

  it('rejects with the HttpError of @helpers4/fetch, so instanceof works with both imports', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('nope', { status: 404 })));
    const error = await fetchOrThrow('https://example.com').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(HttpError);
    expect(error).toBeInstanceOf(fetchCategory.HttpError);
    expect(HttpError).toBe(fetchCategory.HttpError);
  });
});
