/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { toHex } from './toHex';

describe('toHex', () => {
  it('writes two lowercase digits per byte', () => {
    expect(toHex(new Uint8Array([0, 15, 255, 171]))).toBe('000fffab');
  });

  it('writes nothing for no byte', () => {
    expect(toHex(new Uint8Array())).toBe('');
  });
});
