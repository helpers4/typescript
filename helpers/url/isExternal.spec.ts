/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isExternal } from './isExternal';

describe('isExternal — property-based', () => {
  it('never throws', () => {
    fc.assert(fc.property(fc.string(), fc.option(fc.string(), { nil: undefined }), (url, base) => {
      expect(typeof isExternal(url, base)).toBe('boolean');
    }));
  });

  it('a URL on the base origin is never external', () => {
    fc.assert(fc.property(fc.webUrl(), fc.webPath(), (origin, path) => {
      const base = new URL(origin).origin;
      expect(isExternal(`${base}${path}`, base)).toBe(false);
    }));
  });

  it('a root-relative path is never external', () => {
    fc.assert(fc.property(fc.webPath(), (path) => {
      expect(isExternal(path.replace(/^\/+/, '/x'), 'https://example.com')).toBe(false);
    }));
  });
});

describe('isExternal — contract', () => {
  it('empty string is internal', () => {
    expect(isExternal('')).toBe(false);
  });
});
