/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { HttpError as FetchHttpError, fetchOrThrow as fetchOrThrowImpl } from '../fetch/fetchOrThrow';

/**
 * Error thrown by {@link fetchOrThrow} when the server answers with a non-2xx status.
 *
 * It is the very same class as `HttpError` from `@helpers4/fetch`, so `instanceof` works with
 * either import.
 *
 * @deprecated Use `HttpError` from `@helpers4/fetch` instead — same class. This alias will be
 * removed in v4.
 * @since 3.1.3
 */
export const HttpError = FetchHttpError;
/**
 * @deprecated Use `HttpError` from `@helpers4/fetch` instead. This alias will be removed in v4.
 * @since 3.1.3
 */
export type HttpError = FetchHttpError;

/**
 * Wraps `fetch` so that a non-2xx response rejects with an {@link HttpError}.
 *
 * @param input - URL or `Request` object passed to `fetch`
 * @param init - Optional `RequestInit` options passed to `fetch`
 * @returns The response, body unread, when its status is 2xx
 * @throws {HttpError} When the response status is not 2xx
 * @example
 * const response = await fetchOrThrow('https://api.example.com/repo');
 * @deprecated Use `fetchOrThrow` from `@helpers4/fetch` instead — same behavior. It will be
 * removed from `@helpers4/promise` in v4.
 * @since 3.1.3
 */
export async function fetchOrThrow(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return fetchOrThrowImpl(input, init);
}
