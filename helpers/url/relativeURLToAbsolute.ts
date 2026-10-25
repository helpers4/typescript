/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/*
 * This program is under the terms of the GNU Lesser General Public License version 3
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { withoutTrailingSlash } from "./withoutTrailingSlash";
import { withLeadingSlash } from "./withLeadingSlash";
import { cleanPath } from "./cleanPath";

/**
 * Converts a relative URL to an absolute URL, using `base` when given, or else the current
 * document base URI (and the window origin when the document has none).
 *
 * Works outside a browser as long as `base` is passed; without `base` and without a document it
 * throws a `TypeError`, since there is nothing to resolve against.
 *
 * @param relativeUrl - The relative URL to convert
 * @param base - The URL to resolve against. Defaults to the document base URI.
 * @returns The absolute URL
 * @throws {TypeError} If there is no `base` and no document
 * @example
 * relativeURLToAbsolute('/api/data', 'https://example.com') // => 'https://example.com/api/data'
 * @since 1.0.0
 */
export function relativeURLToAbsolute(relativeUrl: string, base?: string): string {
    const root = base ?? globalThis.document?.baseURI ?? globalThis.window?.location?.origin;
    if (root === undefined) {
        throw new TypeError("relativeURLToAbsolute needs a base: pass one, or call it where there is a document");
    }
    return withoutTrailingSlash(root) + cleanPath(withLeadingSlash(relativeUrl));
}
