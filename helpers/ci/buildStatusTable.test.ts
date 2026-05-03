/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { buildStatusTable } from './buildStatusTable';

describe('buildStatusTable', () => {
  it('returns empty string for empty input', () => {
    expect(buildStatusTable({})).toBe('');
  });

  it('produces one row per job', () => {
    const result = buildStatusTable({ Tests: 'success', Lint: 'failure' });
    const rows = result.split('\n');
    expect(rows).toHaveLength(2);
  });

  it('formats a success row correctly', () => {
    const result = buildStatusTable({ 'Unit Tests': 'success' });
    expect(result).toBe('| ✅ | **Unit Tests** | `passing` |');
  });

  it('formats a failure row correctly', () => {
    const result = buildStatusTable({ Lint: 'failure' });
    expect(result).toBe('| ❌ | **Lint** | `failing` |');
  });

  it('formats a skipped row correctly', () => {
    const result = buildStatusTable({ Deploy: 'skipped' });
    expect(result).toBe('| ⏭️ | **Deploy** | `skipped` |');
  });

  it('separates rows with newlines', () => {
    const result = buildStatusTable({ A: 'success', B: 'failure' });
    expect(result).toContain('\n');
    expect(result.split('\n')).toHaveLength(2);
  });
});
