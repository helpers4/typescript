/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isGeneratorFunction } from './isGeneratorFunction';

describe('isGeneratorFunction', () => {
  it('should return true for function* declarations', () => {
    function* gen() { yield 1; }
    expect(isGeneratorFunction(gen)).toBe(true);
  });

  it('should return true for function* expressions', () => {
    const gen = function* () { yield 1; };
    expect(isGeneratorFunction(gen)).toBe(true);
  });

  it('should return false for generator instances', () => {
    function* gen() { yield 1; }
    expect(isGeneratorFunction(gen())).toBe(false);
  });

  it('should return false for async generator functions', () => {
    async function* gen() { yield 1; }
    expect(isGeneratorFunction(gen)).toBe(false);
  });

  it('should return false for regular functions', () => {
    expect(isGeneratorFunction(() => {})).toBe(false);
    expect(isGeneratorFunction(function () {})).toBe(false);
    expect(isGeneratorFunction(async () => {})).toBe(false);
  });

  it('should return false for null, undefined and other types', () => {
    expect(isGeneratorFunction(null)).toBe(false);
    expect(isGeneratorFunction(undefined)).toBe(false);
    expect(isGeneratorFunction(42)).toBe(false);
    expect(isGeneratorFunction({})).toBe(false);
  });
});
