/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isAsyncGeneratorFunction } from './isAsyncGeneratorFunction';

describe('isAsyncGeneratorFunction', () => {
  it('should return true for async function* declarations', () => {
    async function* gen() { yield 1; }
    expect(isAsyncGeneratorFunction(gen)).toBe(true);
  });

  it('should return true for async function* expressions', () => {
    const gen = async function* () { yield 1; };
    expect(isAsyncGeneratorFunction(gen)).toBe(true);
  });

  it('should return false for async generator instances', () => {
    async function* gen() { yield 1; }
    expect(isAsyncGeneratorFunction(gen())).toBe(false);
  });

  it('should return false for sync generator functions', () => {
    function* gen() { yield 1; }
    expect(isAsyncGeneratorFunction(gen)).toBe(false);
  });

  it('should return false for regular and async functions', () => {
    expect(isAsyncGeneratorFunction(() => {})).toBe(false);
    expect(isAsyncGeneratorFunction(async () => {})).toBe(false);
    expect(isAsyncGeneratorFunction(function () {})).toBe(false);
  });

  it('should return false for null, undefined and other types', () => {
    expect(isAsyncGeneratorFunction(null)).toBe(false);
    expect(isAsyncGeneratorFunction(undefined)).toBe(false);
    expect(isAsyncGeneratorFunction(42)).toBe(false);
    expect(isAsyncGeneratorFunction({})).toBe(false);
  });
});
