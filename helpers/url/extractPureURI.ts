/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/*
 * This program is under the terms of the GNU Lesser General Public License version 3
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Extracts the pure URI from a URL by removing query parameters and fragments.
 *
 * @param url - The URL string to process
 * @returns The URI without query parameters and fragments, or the original value if undefined/null
 * @since 1.9.0
 */
export function extractPureURI(url: string): string;
export function extractPureURI(url: undefined): undefined;
export function extractPureURI(url: null): null;
export function extractPureURI(url: string | undefined | null): string | undefined | null {
  if (url === undefined || url === null) {
    return url;
  }

  // Find the first occurrence of ? or #
  const queryIndex = url.indexOf('?');
  const fragmentIndex = url.indexOf('#');

  let cutIndex = -1;

  if (queryIndex !== -1 && fragmentIndex !== -1) {
    // Both exist, take the earliest one
    cutIndex = Math.min(queryIndex, fragmentIndex);
  } else if (queryIndex !== -1) {
    // Only query exists
    cutIndex = queryIndex;
  } else if (fragmentIndex !== -1) {
    // Only fragment exists
    cutIndex = fragmentIndex;
  }

  // If no query or fragment found, return the original string
  if (cutIndex === -1) {
    return url;
  }

  // Return the substring up to the first ? or #
  return url.substring(0, cutIndex);
}
