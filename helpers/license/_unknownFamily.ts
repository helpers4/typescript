/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Sentinel family for a license token that carries no comparable content — `custom`, a bare
 * vendor name inside `custom:<...>`/`LicenseRef-<...>`, or an explicit "we don't know". Two
 * unknown tokens are never treated as either agreeing or conflicting with each other, since
 * neither is a real claim to compare against the other.
 *
 * Not exported from the package — `families()`, `agree()` and `isKnown()` already fully
 * encapsulate this concept; a consumer never needs the sentinel's actual value.
 * @ignore
 */
export const UNKNOWN_FAMILY = 'unknown';
