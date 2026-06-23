/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isError } from './isError';

describe('isError', () => {
  it('should return true for Error instances', () => {
    expect(isError(new Error('oops'))).toBe(true);
  });

  it('should return true for Error subclasses', () => {
    expect(isError(new TypeError('bad type'))).toBe(true);
    expect(isError(new RangeError('out of range'))).toBe(true);
    expect(isError(new SyntaxError('syntax'))).toBe(true);
    expect(isError(new ReferenceError('ref'))).toBe(true);
  });

  it('should return true for custom Error subclasses', () => {
    class CustomError extends Error { }
    expect(isError(new CustomError('custom'))).toBe(true);
  });

  it('should return false for error-like objects', () => {
    expect(isError({ message: 'fake' })).toBe(false);
    expect(isError({ message: 'fake', stack: 'trace' })).toBe(false);
  });

  it('should return false for non-errors', () => {
    expect(isError('error')).toBe(false);
    expect(isError(42)).toBe(false);
    expect(isError(null)).toBe(false);
    expect(isError(undefined)).toBe(false);
  });
});
