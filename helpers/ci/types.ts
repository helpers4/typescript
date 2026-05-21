/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Canonical CI/CD job status values.
 * The `string & {}` intersection allows any custom status string while
 * still enabling IDE auto-completion for the known values.
 *
 * @since 2.0.0
 */
export type CiStatus = 'success' | 'failure' | 'skipped' | 'unknown' | (string & {});
