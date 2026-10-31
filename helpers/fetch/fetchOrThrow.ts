/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Error thrown by {@link fetchOrThrow} when the server answers with a non-2xx status.
 * Carries the status and the response itself, so a caller can still read its body.
 * @since next
 */
export class HttpError extends Error {
  /** HTTP status code, e.g. `404`. */
  readonly status: number;
  /** HTTP status text, e.g. `'Not Found'` (often empty over HTTP/2). */
  readonly statusText: string;
  /** The URL that was requested — the final one, after redirects, when the response knows it. */
  readonly url: string;
  /** The response itself, body unread. */
  readonly response: Response;

  constructor(response: Response, url: string) {
    super(`HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ''}: ${url}`);
    this.name = 'HttpError';
    this.status = response.status;
    this.statusText = response.statusText;
    this.url = url;
    this.response = response;
  }
}

/**
 * Wraps `fetch` so that a non-2xx response rejects with an {@link HttpError}, instead of
 * resolving like any other response — the throwing counterpart to `safeFetch`, for when a
 * failed request should fail loud. Network errors reject as `fetch` itself rejects them.
 *
 * @param input - URL or `Request` object passed to `fetch`
 * @param init - Optional `RequestInit` options passed to `fetch`
 * @returns The response, body unread, when its status is 2xx
 * @throws {HttpError} When the response status is not 2xx
 * @example
 * const response = await fetchOrThrow('https://api.example.com/repo');
 * const repo = await response.json();
 * @example
 * try {
 *   await fetchOrThrow('https://api.example.com/missing');
 * } catch (error) {
 *   if (error instanceof HttpError && error.status === 404) { /* not found *\/ }
 * }
 * @since next
 */
export async function fetchOrThrow(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new HttpError(response, response.url || requestUrl(input));
  }
  return response;
}

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input;
  return input instanceof URL ? input.href : input.url;
}
