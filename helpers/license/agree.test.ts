/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { agree } from './agree';

describe('agree', () => {
  it('agrees on real-world notation drift', () => {
    expect(agree('GPL', 'GPL-3.0-or-later')).toBe(true);
    expect(agree('GPL3', 'GPL-3.0-or-later')).toBe(true);
    expect(agree('GPL2', 'GPL-2.0-only')).toBe(true);
    expect(agree('EULA', 'LicenseRef-EULA')).toBe(true);
  });

  it('flags a real family conflict', () => {
    expect(agree('BSD-2-Clause', 'Apache-2.0')).toBe(false);
  });

  it('never flags a conflict when either side is non-informative', () => {
    expect(agree('custom', 'MIT')).toBe(true);
    expect(agree('unknown', 'GPL-3.0-only')).toBe(true);
    expect(agree('custom:brother', 'custom:jetbrains')).toBe(true);
  });

  it('agrees when a compound expression shares at least one family', () => {
    expect(agree('GPL-2.0-or-later AND LGPL-2.0-or-later', 'GPL3')).toBe(true);
  });

  it('is symmetric', () => {
    expect(agree('MIT', 'Apache-2.0')).toBe(agree('Apache-2.0', 'MIT'));
    expect(agree('MIT', 'MIT')).toBe(agree('MIT', 'MIT'));
  });

  it('agrees when both sides are identical', () => {
    expect(agree('MIT', 'MIT')).toBe(true);
  });
});
