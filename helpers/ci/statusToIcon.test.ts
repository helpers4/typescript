/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { statusToIcon } from './statusToIcon';

describe('statusToIcon', () => {
  it('returns ✅ for success', () => {
    expect(statusToIcon('success')).toBe('✅');
  });

  it('returns ❌ for failure', () => {
    expect(statusToIcon('failure')).toBe('❌');
  });

  it('returns ⏭️ for skipped', () => {
    expect(statusToIcon('skipped')).toBe('⏭️');
  });

  it('returns ⚠️ for unknown', () => {
    expect(statusToIcon('unknown')).toBe('⚠️');
  });

  it('returns ⚠️ for any other string', () => {
    expect(statusToIcon('pending')).toBe('⚠️');
    expect(statusToIcon('cancelled')).toBe('⚠️');
    expect(statusToIcon('')).toBe('⚠️');
  });
});
