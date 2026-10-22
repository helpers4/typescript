/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { isBrowser } from './isBrowser';

describe('isBrowser', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns true when window and window.document are both defined', () => {
    vi.stubGlobal('window', { document: {} });
    expect(isBrowser()).toBe(true);
  });

  it('returns false when window is undefined', () => {
    vi.stubGlobal('window', undefined);
    expect(isBrowser()).toBe(false);
  });

  it('returns false when window is defined but window.document is not', () => {
    vi.stubGlobal('window', {});
    expect(isBrowser()).toBe(false);
  });
});
