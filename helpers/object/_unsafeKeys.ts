/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Keys that must never be set on a plain object (prototype-pollution guard).
 * @internal
 */
export const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
