/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { statusToBadge } from './statusToBadge';
import { statusToIcon } from './statusToIcon';

/**
 * Builds a Markdown table body from a map of job names to CI/CD statuses.
 * Each row follows the format `| icon | **Job Name** | badge |`.
 *
 * Intended to be embedded in a PR comment template:
 * ```
 * | | Job | Status |
 * |:---:|-----|:------:|
 * ${buildStatusTable(jobs)}
 * ```
 *
 * @param jobs - Record mapping job display names to their CI status
 * @returns Newline-separated Markdown table rows (no header, no footer)
 * @example
 * buildStatusTable({ 'Unit Tests': 'success', 'Lint': 'failure' })
 * // => '| ✅ | **Unit Tests** | `passing` |\n| ❌ | **Lint** | `failing` |'
 * @since 2.0.0
 */
export function buildStatusTable(jobs: Record<string, string>): string {
  return Object.entries(jobs)
    .map(([job, status]) => {
      const safeJob = job
        .replace(/\\/g, '\\\\')
        .replace(/\|/g, '\\|')
        .replace(/\n/g, ' ')
        .replace(/\*/g, '\\*')
        .replace(/_/g, '\\_')
        .replace(/`/g, '\\`');
      return `| ${statusToIcon(status)} | **${safeJob}** | ${statusToBadge(status)} |`;
    })
    .join('\n');
}
