/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Options for {@link safeFetch}.
 * @since next
 */
export interface SafeFetchOptions {
  /**
   * How to parse the response body.
   * - `'json'` (default) — calls `response.json()`
   * - `'text'` — calls `response.text()`
   */
  parse?: 'json' | 'text';
}

/**
 * Wraps `fetch` with built-in error handling: returns `null` when the
 * request fails (network error, non-OK status, or parse error) instead
 * of throwing.
 *
 * @param input - URL or `Request` object passed to `fetch`
 * @param init - Optional `RequestInit` options passed to `fetch`
 * @param options - Parsing options (default: `{ parse: 'json' }`)
 * @returns The parsed response body, or `null` on any failure
 * @example
 * const data = await safeFetch<{ stars: number }>('https://api.example.com/repo');
 * if (data === null) { /* handle error *\/ }
 * @since next
 */
export async function safeFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
  options: SafeFetchOptions = {}
): Promise<T | null> {
  const { parse = 'json' } = options;
  try {
    const response = await fetch(input, init);
    if (!response.ok) return null;
    return (parse === 'text' ? await response.text() : await response.json()) as T;
  } catch {
    return null;
  }
}
