/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { safeFetch as safeFetchImpl } from '../fetch/safeFetch';
import type { SafeFetchOptions as FetchSafeFetchOptions } from '../fetch/safeFetch';

/**
 * Options for {@link safeFetch}.
 * @deprecated Use `SafeFetchOptions` from `@helpers4/fetch` instead — same type. This alias will
 * be removed in v4.
 * @since 2.0.0
 */
export type SafeFetchOptions = FetchSafeFetchOptions;

/**
 * Wraps `fetch` and returns `null` when the request fails (network error, non-OK status, or parse
 * error) instead of throwing.
 *
 * @param input - URL or `Request` object passed to `fetch`
 * @param init - Optional `RequestInit` options passed to `fetch`
 * @param options - Parsing options (default: `{ parse: 'json' }`)
 * @returns The parsed response body, or `null` on any failure
 * @example
 * const data = await safeFetch<{ stars: number }>('https://api.example.com/repo');
 * @deprecated Use `safeFetch` from `@helpers4/fetch` instead — same behavior. It will be removed
 * from `@helpers4/promise` in v4.
 * @since 2.0.0
 */
export async function safeFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
  options: SafeFetchOptions = {},
): Promise<T | null> {
  return safeFetchImpl<T>(input, init, options);
}
