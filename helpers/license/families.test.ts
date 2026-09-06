/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { families } from './families';

describe('families', () => {
  it('groups real-world GPL notation variants into one family', () => {
    for (const raw of ['GPL', 'GPL2', 'GPL3', 'GPL-3.0-or-later', 'GPL-2.0-only', 'GPLv3', 'GPL3+']) {
      expect(families(raw)).toEqual(new Set(['gpl']));
    }
  });

  it('keeps LGPL and AGPL as families distinct from GPL', () => {
    expect(families('LGPL-3.0-only')).toEqual(new Set(['lgpl']));
    expect(families('AGPL3')).toEqual(new Set(['agpl']));
  });

  it('recognizes MIT, BSD and Apache variants', () => {
    expect(families('MIT')).toEqual(new Set(['mit']));
    expect(families('BSD-3-Clause')).toEqual(new Set(['bsd']));
    expect(families('Apache-2.0')).toEqual(new Set(['apache']));
  });

  it('splits an SPDX AND expression into multiple families', () => {
    expect(families('GPL-3.0+ AND LGPL-3.0+')).toEqual(new Set(['gpl', 'lgpl']));
  });

  it('splits a lowercase compound expression the same way', () => {
    expect(families('GPL-2.0+ and GFDL-1.3')).toEqual(new Set(['gpl', 'gfdl']));
    expect(families('MIT OR Apache-2.0')).toEqual(new Set(['mit', 'apache']));
  });

  it('drops a WITH exception clause instead of treating it as its own family', () => {
    expect(families('Apache-2.0 WITH LLVM-exception')).toEqual(new Set(['apache']));
  });

  it('collapses custom/unknown/proprietary tokens to the unknown family, not their own families', () => {
    for (const raw of [
      'custom', 'custom:MIT', 'custom:Epson End User Software License Agreement',
      'unknown', 'unknow', 'LicenseRef-EULA', 'LicenseRef-proprietary', 'None', 'various',
    ]) {
      expect(families(raw)).toEqual(new Set(['unknown']));
    }
  });

  it('matches case-insensitively', () => {
    expect(families('mit')).toEqual(new Set(['mit']));
    expect(families('Bsd-3-Clause')).toEqual(new Set(['bsd']));
  });

  it('returns an empty set for an empty string', () => {
    expect(families('')).toEqual(new Set());
  });
});
