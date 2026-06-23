/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Keys that must never be set on a plain object (prototype-pollution guard).
 * @ignore
 */
const UNSAFE_KEY_LIST = ['__proto__', 'constructor', 'prototype'] as const;

/** @ignore */
export type UnsafeKey = (typeof UNSAFE_KEY_LIST)[number];

export const UNSAFE_KEYS = new Set<string>(UNSAFE_KEY_LIST);
