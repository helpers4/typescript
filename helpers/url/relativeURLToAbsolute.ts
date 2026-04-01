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

export function relativeURLToAbsolute(relativeUrl: string): string {
    return (
        withoutTrailingSlash(document.baseURI ?? window.location.origin) +
        cleanPath(withLeadingSlash(relativeUrl))
    );
}
