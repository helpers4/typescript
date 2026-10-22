/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { buildStatusTable } from './buildStatusTable';

describe('buildStatusTable — property-based', () => {
  it('row count equals number of jobs', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(fc.string({ minLength: 1, maxLength: 10 }), { maxLength: 10 }),
        (jobNames) => {
          const jobs = Object.fromEntries(jobNames.map(n => [n, 'success']));
          const result = buildStatusTable(jobs);
          if (jobNames.length === 0) {
            expect(result).toBe('');
          } else {
            expect(result.split('\n')).toHaveLength(jobNames.length);
          }
        }
      )
    );
  });

  it('each row starts with | and ends with |', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 1, maxLength: 5 }),
        (jobNames) => {
          const jobs = Object.fromEntries(jobNames.map(n => [n, 'success']));
          for (const row of buildStatusTable(jobs).split('\n')) {
            expect(row.startsWith('|')).toBe(true);
            expect(row.endsWith('|')).toBe(true);
          }
        }
      )
    );
  });
});
