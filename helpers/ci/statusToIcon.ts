/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { CiStatus } from './types';

/**
 * Maps a CI/CD job status to an emoji icon.
 *
 * | Status | Icon |
 * |--------|------|
 * | `success` | ✅ |
 * | `failure` | ❌ |
 * | `skipped` | ⏭️ |
 * | *(other)* | ⚠️ |
 *
 * @param status - The CI/CD job status
 * @returns An emoji representing the status
 * @see {@link statusToBadge} for a text badge equivalent
 * @example
 * statusToIcon('success')  // => '✅'
 * statusToIcon('failure')  // => '❌'
 * statusToIcon('skipped')  // => '⏭️'
 * statusToIcon('pending')  // => '⚠️'
 * @since next
 */
export function statusToIcon(status: CiStatus): string {
  switch (status) {
    case 'success': return '✅';
    case 'failure': return '❌';
    case 'skipped': return '⏭️';
    default: return '⚠️';
  }
}
