/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { uuid7 } from './uuid7';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('uuid7', () => {
  it('should return a valid UUID v7 string', () => {
    const id = uuid7();
    expect(id).toMatch(UUID_REGEX);
  });

  it('should have version 7', () => {
    const id = uuid7();
    expect(id[14]).toBe('7');
  });

  it('should have correct variant (8, 9, a, or b)', () => {
    for (let i = 0; i < 100; i++) {
      const id = uuid7();
      expect(['8', '9', 'a', 'b']).toContain(id[19]);
    }
  });

  it('should generate unique values', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      ids.add(uuid7());
    }
    expect(ids.size).toBe(1000);
  });

  it('should be chronologically sortable', () => {
    const id1 = uuid7();
    // Small delay to ensure different timestamp
    const start = Date.now();
    while (Date.now() === start) {
      // busy-wait for next millisecond
    }
    const id2 = uuid7();
    expect(id1 < id2).toBe(true);
  });

  it('should embed a valid timestamp', () => {
    const before = Date.now();
    const id = uuid7();
    const after = Date.now();

    // Extract timestamp from first 12 hex chars (48 bits)
    const hex = id.replace(/-/g, '').slice(0, 12);
    const timestamp = parseInt(hex, 16);

    expect(timestamp).toBeGreaterThanOrEqual(before);
    expect(timestamp).toBeLessThanOrEqual(after);
  });

  it('should have correct length', () => {
    expect(uuid7()).toHaveLength(36);
  });

  it('should have hyphens at correct positions', () => {
    const id = uuid7();
    expect(id[8]).toBe('-');
    expect(id[13]).toBe('-');
    expect(id[18]).toBe('-');
    expect(id[23]).toBe('-');
  });
});
