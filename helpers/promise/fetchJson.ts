/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { HttpError, fetchOrThrow } from './fetchOrThrow';
import { retry } from './retry';
import type { RetryOptions } from './retry';

/**
 * Options for {@link fetchJson}.
 * @since 3.1.5
 */
export interface FetchJsonOptions {
  /**
   * How to retry a failed request — see {@link RetryOptions}. By default, up to 3 attempts, 1 s
   * apart, and only transient failures are retried (see {@link fetchJson}). Passing your own
   * `shouldRetry` replaces that rule.
   */
  retry?: RetryOptions;
}

// A network failure (fetch rejects with a TypeError), a server error or a rate limit may go away
// on their own. A 4xx, an invalid JSON body or an aborted request will not.
function isTransient(error: unknown): boolean {
  if (error instanceof HttpError) return error.status >= 500 || error.status === 429;
  if (error instanceof SyntaxError) return false;
  return !(error instanceof Error && error.name === 'AbortError');
}

/**
 * Fetches a URL and returns its parsed JSON body, retrying transient failures.
 *
 * Retried: network errors, `5xx` and `429` responses. Not retried, and thrown at once: other
 * `4xx` responses, a body that is not valid JSON (a `SyntaxError`) and an aborted request.
 * After the last attempt, the last error is thrown: an {@link HttpError} (with `status` and
 * `url`) for a bad status, or whatever `fetch` rejected with.
 *
 * Pass a URL or a string: a `Request` with a body cannot be sent twice, so it can't be retried.
 *
 * @param input - URL or `Request` object passed to `fetch`
 * @param init - Optional `RequestInit` options passed to `fetch`
 * @param options - Retry configuration — see {@link FetchJsonOptions}
 * @returns The parsed JSON body
 * @throws {HttpError} When the last attempt got a non-2xx status
 * @throws {SyntaxError} When the body is not valid JSON
 * @example
 * const repo = await fetchJson<{ stars: number }>('https://api.example.com/repo');
 * @example
 * // 5 attempts, with a growing delay
 * await fetchJson('https://api.example.com/repo', undefined, {
 *   retry: { attempts: 5, delayMs: (attempt) => 500 * 2 ** (attempt - 1) },
 * })
 * @see {@link safeFetch} for a version that returns `null` instead of throwing
 * @since 3.1.5
 */
export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
  options: FetchJsonOptions = {},
): Promise<T> {
  const { shouldRetry = isTransient, ...retryOptions } = options.retry ?? {};
  return retry(
    async () => {
      const response = await fetchOrThrow(input, init);
      return (await response.json()) as T;
    },
    { ...retryOptions, shouldRetry },
  );
}
