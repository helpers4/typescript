/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { Duplex, PassThrough, Readable, Transform, Writable } from 'node:stream';
import { describe, expect, it } from 'vitest';
import { isNodeStream } from './isNodeStream';

describe('isNodeStream', () => {
  it('should return true for Readable streams', () => {
    expect(isNodeStream(new Readable({ read() {} }))).toBe(true);
  });

  it('should return true for Writable streams', () => {
    expect(isNodeStream(new Writable({ write() {} }))).toBe(true);
  });

  it('should return true for Duplex and Transform streams', () => {
    expect(isNodeStream(new Duplex())).toBe(true);
    expect(isNodeStream(new Transform())).toBe(true);
    expect(isNodeStream(new PassThrough())).toBe(true);
  });

  it('should return true for any object with a pipe function', () => {
    expect(isNodeStream({ pipe: () => {} })).toBe(true);
  });

  it('should return false when pipe is not a function', () => {
    expect(isNodeStream({ pipe: 'not-a-function' })).toBe(false);
    expect(isNodeStream({ pipe: null })).toBe(false);
    expect(isNodeStream({ pipe: 42 })).toBe(false);
  });

  it('should return false for objects without pipe', () => {
    expect(isNodeStream({})).toBe(false);
    expect(isNodeStream({ read: () => {} })).toBe(false);
  });

  it('should return false for null and undefined', () => {
    expect(isNodeStream(null)).toBe(false);
    expect(isNodeStream(undefined)).toBe(false);
  });

  it('should return false for primitives', () => {
    expect(isNodeStream(42)).toBe(false);
    expect(isNodeStream('stream')).toBe(false);
    expect(isNodeStream(true)).toBe(false);
  });
});
