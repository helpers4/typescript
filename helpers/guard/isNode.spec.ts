/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { isNode } from './isNode';

describe('isNode — property-based', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('matches whether process.versions.node is present, for any process-shaped stub', () => {
    fc.assert(
      fc.property(fc.boolean(), (hasNode) => {
        vi.stubGlobal('process', hasNode ? { versions: { node: '26.0.0' } } : { versions: {} });
        expect(isNode()).toBe(hasNode);
        vi.unstubAllGlobals();
      }),
    );
  });
});

describe('isNode — contract', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('is false when process itself is missing', () => {
    vi.stubGlobal('process', undefined);
    expect(isNode()).toBe(false);
  });
});
