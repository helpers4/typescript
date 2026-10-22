/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { isNode } from './isNode';

describe('isNode', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns true in the real Node.js test environment', () => {
    expect(isNode()).toBe(true);
  });

  it('returns false when process is undefined', () => {
    vi.stubGlobal('process', undefined);
    expect(isNode()).toBe(false);
  });

  it('returns false when process.versions.node is not a string', () => {
    vi.stubGlobal('process', { versions: {} });
    expect(isNode()).toBe(false);
  });
});
