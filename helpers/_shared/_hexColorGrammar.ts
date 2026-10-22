/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Regex source for a bare 3, 4, 6, or 8 hex-digit run (no `#`, no anchors) —
 * the digit grammar shared by every hex color format (`#rgb`, `#rgba`,
 * `#rrggbb`, `#rrggbbaa`). Consumers compose their own anchoring/capturing
 * around this fragment since their needs differ (e.g. whether `#` is
 * optional, whether the digits are captured for parsing or just validated).
 */
export const HEX_COLOR_DIGITS = '[\\da-f]{3}|[\\da-f]{4}|[\\da-f]{6}|[\\da-f]{8}';
