/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { premultiply } from './premultiply';

describe('premultiply', () => {
  it('multiplies the channels by the alpha', () => {
    expect(premultiply({ r: 255, g: 100, b: 0, a: 0.5 })).toEqual({ r: 127.5, g: 50, b: 0, a: 0.5 });
  });

  it('treats a missing alpha as opaque', () => {
    expect(premultiply({ r: 10, g: 20, b: 30 })).toEqual({ r: 10, g: 20, b: 30, a: 1 });
  });

  it('zeroes the channels of a transparent color', () => {
    expect(premultiply({ r: 10, g: 20, b: 30, a: 0 })).toEqual({ r: 0, g: 0, b: 0, a: 0 });
  });
});
