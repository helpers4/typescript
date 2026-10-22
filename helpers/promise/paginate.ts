/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Options for {@link paginate}.
 * @since 3.1.5
 */
export interface PaginateOptions {
  /**
   * Expected number of items in a full page. A page with fewer items is the last one, which
   * saves the request that would come back empty. Without it, only `null` or an empty page
   * stops the loop.
   */
  pageSize?: number;
  /** Maximum number of pages to request. Defaults to no limit; a value below `1` requests nothing. */
  maxPages?: number;
}

/**
 * Collects every item of a paginated source by requesting pages one after the other, from
 * page 1, until the source runs out.
 *
 * It stops after a page that is `null`, empty, or shorter than `pageSize`, or once `maxPages`
 * pages were requested. A `null` page is not added to the result. A rejection from
 * `fetchPage` rejects the whole call, and the items already collected are lost.
 *
 * Without `maxPages`, a source that never returns a short or empty page is requested forever,
 * so set one for an API you do not control.
 *
 * @param fetchPage - Returns the items of a page, given its 1-based number, or `null` for no data
 * @param options - Page size and page limit — see {@link PaginateOptions}
 * @returns All the items, in page order
 * @example
 * const repos = await paginate(
 *   (page) => safeFetch<Repo[]>(`https://api.github.com/orgs/helpers4/repos?per_page=100&page=${page}`),
 *   { pageSize: 100, maxPages: 5 },
 * )
 * @example
 * // Offset-based API: derive the offset from the page number
 * const posts = await paginate((page) => fetchPosts({ limit: 50, offset: (page - 1) * 50 }), { pageSize: 50 })
 * @since 3.1.5
 */
export async function paginate<T>(
  fetchPage: (page: number) => Promise<readonly T[] | null>,
  options: PaginateOptions = {},
): Promise<T[]> {
  const { pageSize, maxPages = Infinity } = options;
  const items: T[] = [];
  for (let page = 1; page <= maxPages; page++) {
    // Sequential on purpose: whether to ask for the next page depends on this one.
    // eslint-disable-next-line no-await-in-loop
    const batch = await fetchPage(page);
    if (batch === null || batch.length === 0) break;
    items.push(...batch);
    if (pageSize !== undefined && batch.length < pageSize) break;
  }
  return items;
}
