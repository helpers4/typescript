/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { pickClosest } from './pickClosest';

const weights = (list: number[]) => list.map((weight) => ({ weight }));

describe('pickClosest', () => {
  it('returns undefined without faces', () => {
    expect(pickClosest([])).toBeUndefined();
  });

  it('returns an exact match', () => {
    expect(pickClosest(weights([300, 400, 700]), { weight: 700 })).toEqual({ weight: 700 });
  });

  it('defaults to a regular face', () => {
    expect(pickClosest(weights([300, 400, 700]))).toEqual({ weight: 400 });
    expect(pickClosest([{}, { weight: 700 }])).toEqual({});
  });

  describe('weight', () => {
    it('below 400, goes lighter first, then heavier', () => {
      expect(pickClosest(weights([100, 300, 500]), { weight: 200 })).toEqual({ weight: 100 });
      expect(pickClosest(weights([500, 700]), { weight: 300 })).toEqual({ weight: 500 });
    });

    it('above 500, goes heavier first, then lighter', () => {
      expect(pickClosest(weights([300, 700, 900]), { weight: 600 })).toEqual({ weight: 700 });
      expect(pickClosest(weights([300, 400]), { weight: 800 })).toEqual({ weight: 400 });
    });

    it('from 400 to 500, goes heavier up to 500, then lighter, then heavier above 500', () => {
      expect(pickClosest(weights([300, 500, 700]), { weight: 400 })).toEqual({ weight: 500 });
      expect(pickClosest(weights([300, 400, 700]), { weight: 500 })).toEqual({ weight: 400 });
      expect(pickClosest(weights([300, 700]), { weight: 450 })).toEqual({ weight: 300 });
      expect(pickClosest(weights([600, 700]), { weight: 400 })).toEqual({ weight: 600 });
    });
  });

  describe('style', () => {
    const faces = [
      { weight: 400, style: 'normal' as const },
      { weight: 400, style: 'oblique' as const },
      { weight: 400, style: 'italic' as const },
    ];

    it('prefers the asked style, then its neighbours', () => {
      expect(pickClosest(faces, { style: 'italic' })?.style).toBe('italic');
      expect(pickClosest(faces, { style: 'oblique' })?.style).toBe('oblique');
      expect(pickClosest(faces, { style: 'normal' })?.style).toBe('normal');
    });

    it('falls back along the CSS order', () => {
      expect(pickClosest(faces.slice(1), { style: 'normal' })?.style).toBe('oblique');
      expect(pickClosest([faces[0]!, faces[2]!], { style: 'oblique' })?.style).toBe('italic');
      expect(pickClosest([faces[0]!], { style: 'italic' })?.style).toBe('normal');
    });

    it('matches the style before the weight', () => {
      const mixed = [{ weight: 700 }, { weight: 400, style: 'italic' as const }];
      expect(pickClosest(mixed, { weight: 700, style: 'italic' })).toEqual({ weight: 400, style: 'italic' });
    });
  });

  describe('stretch', () => {
    const faces = [{ stretch: 75 }, { stretch: 100 }, { stretch: 125 }];

    it('goes narrower first at or below 100, then wider', () => {
      expect(pickClosest([{ stretch: 75 }, { stretch: 125 }], { stretch: 90 })).toEqual({ stretch: 75 });
      expect(pickClosest([{ stretch: 110 }, { stretch: 125 }], { stretch: 90 })).toEqual({ stretch: 110 });
      expect(pickClosest(faces, { stretch: 100 })).toEqual({ stretch: 100 });
    });

    it('goes wider first above 100, then narrower', () => {
      expect(pickClosest([{ stretch: 75 }, { stretch: 125 }], { stretch: 110 })).toEqual({ stretch: 125 });
      expect(pickClosest([{ stretch: 75 }, { stretch: 90 }], { stretch: 110 })).toEqual({ stretch: 90 });
    });

    it('matches the stretch before the style and the weight', () => {
      const mixed = [{ weight: 400, stretch: 100 }, { weight: 700, stretch: 75 }];
      expect(pickClosest(mixed, { weight: 400, stretch: 75 })).toEqual({ weight: 700, stretch: 75 });
    });
  });

  it('returns the first of several equally close faces, keeping extra fields', () => {
    const faces = [
      { weight: 400, file: 'a.woff2' },
      { weight: 400, file: 'b.woff2' },
    ];
    expect(pickClosest(faces)?.file).toBe('a.woff2');
  });
});
