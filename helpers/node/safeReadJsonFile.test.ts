/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { safeReadJsonFile } from './safeReadJsonFile';

describe('safeReadJsonFile', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'helpers4-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('parses a valid JSON object file', () => {
    const filePath = join(dir, 'valid.json');
    writeFileSync(filePath, JSON.stringify({ a: 1 }));
    expect(safeReadJsonFile<{ a: number }>(filePath)).toEqual({ a: 1 });
  });

  it('parses a valid JSON array file', () => {
    const filePath = join(dir, 'array.json');
    writeFileSync(filePath, '[1,2,3]');
    expect(safeReadJsonFile<number[]>(filePath)).toEqual([1, 2, 3]);
  });

  it('returns null by default when the file does not exist', () => {
    expect(safeReadJsonFile(join(dir, 'missing.json'))).toBeNull();
  });

  it('returns null by default when the file contains invalid JSON', () => {
    const filePath = join(dir, 'invalid.json');
    writeFileSync(filePath, '{ not json');
    expect(safeReadJsonFile(filePath)).toBeNull();
  });

  it('returns the fallback when the file does not exist', () => {
    expect(safeReadJsonFile(join(dir, 'missing.json'), [])).toEqual([]);
  });

  it('returns the fallback when the file contains invalid JSON', () => {
    const filePath = join(dir, 'invalid.json');
    writeFileSync(filePath, 'not json');
    expect(safeReadJsonFile(filePath, 0)).toBe(0);
  });

  it('returns undefined when undefined is explicitly passed as fallback', () => {
    // Runtime must agree with the typings: passing undefined explicitly
    // should not be silently coerced into null.
    expect(safeReadJsonFile<unknown>(join(dir, 'missing.json'), undefined)).toBeUndefined();
  });

  it('returns a fallback object on failure', () => {
    const fallback = { error: true };
    expect(safeReadJsonFile(join(dir, 'missing.json'), fallback)).toBe(fallback);
  });
});
