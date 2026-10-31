/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { fetchJson as fetchJsonImpl } from '../fetch/fetchJson';
import type { FetchJsonOptions as FetchFetchJsonOptions } from '../fetch/fetchJson';

/**
 * Options for {@link fetchJson}.
 * @deprecated Use `FetchJsonOptions` from `@helpers4/fetch` instead — same type. This alias will
 * be removed in v4.
 * @since 3.1.5
 */
export type FetchJsonOptions = FetchFetchJsonOptions;

/**
 * Fetches a URL and returns its parsed JSON body, retrying transient failures (network errors,
 * `5xx` and `429`).
 *
 * @param input - URL or `Request` object passed to `fetch`
 * @param init - Optional `RequestInit` options passed to `fetch`
 * @param options - Retry configuration — see {@link FetchJsonOptions}
 * @returns The parsed JSON body
 * @example
 * const repo = await fetchJson<{ stars: number }>('https://api.example.com/repo');
 * @deprecated Use `fetchJson` from `@helpers4/fetch` instead — same behavior. It will be removed
 * from `@helpers4/promise` in v4.
 * @since 3.1.5
 */
export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
  options: FetchJsonOptions = {},
): Promise<T> {
  return fetchJsonImpl<T>(input, init, options);
}
