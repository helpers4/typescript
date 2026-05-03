/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { statusToBadge } from './statusToBadge';

describe('statusToBadge', () => {
  it('returns `passing` for success', () => {
    expect(statusToBadge('success')).toBe('`passing`');
  });

  it('returns `failing` for failure', () => {
    expect(statusToBadge('failure')).toBe('`failing`');
  });

  it('returns `skipped` for skipped', () => {
    expect(statusToBadge('skipped')).toBe('`skipped`');
  });

  it('returns `unknown` for unknown', () => {
    expect(statusToBadge('unknown')).toBe('`unknown`');
  });

  it('returns `unknown` for any other string', () => {
    expect(statusToBadge('pending')).toBe('`unknown`');
    expect(statusToBadge('')).toBe('`unknown`');
  });
});
