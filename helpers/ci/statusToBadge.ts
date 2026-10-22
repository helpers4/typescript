/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { CiStatus } from './types';

/**
 * Maps a CI/CD job status to an inline code badge string.
 *
 * | Status | Badge |
 * |--------|-------|
 * | `success` | `` `passing` `` |
 * | `failure` | `` `failing` `` |
 * | `skipped` | `` `skipped` `` |
 * | *(other)* | `` `unknown` `` |
 *
 * @param status - The CI/CD job status
 * @returns A Markdown inline-code badge
 * @see {@link statusToIcon} for an emoji icon equivalent
 * @example
 * statusToBadge('success')  // => '`passing`'
 * statusToBadge('failure')  // => '`failing`'
 * statusToBadge('skipped')  // => '`skipped`'
 * statusToBadge('pending')  // => '`unknown`'
 * @since 2.0.0
 */
export function statusToBadge(status: CiStatus): string {
  switch (status) {
    case 'success': return '`passing`';
    case 'failure': return '`failing`';
    case 'skipped': return '`skipped`';
    default: return '`unknown`';
  }
}
