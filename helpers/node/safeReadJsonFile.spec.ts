/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import * as fc from 'fast-check';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { safeReadJsonFile } from './safeReadJsonFile';

describe('safeReadJsonFile — property-based', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'helpers4-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('round-trips any JSON-serialisable value written to disk', () => {
    fc.assert(
      fc.property(fc.jsonValue(), (value) => {
        const filePath = join(dir, 'value.json');
        const json = JSON.stringify(value);
        writeFileSync(filePath, json);
        // Both sides go through JSON encoding — -0 becomes 0 in JSON (expected)
        expect(safeReadJsonFile(filePath)).toEqual(JSON.parse(json));
      }),
    );
  });

  it('always returns the fallback for non-JSON file contents', () => {
    const fallback = 'FALLBACK';
    fc.assert(
      fc.property(
        fc.string().filter((s) => {
          try {
            JSON.parse(s);
            return false;
          } catch {
            return true;
          }
        }),
        (invalidJson) => {
          const filePath = join(dir, 'invalid.json');
          writeFileSync(filePath, invalidJson);
          expect(safeReadJsonFile(filePath, fallback)).toBe(fallback);
        },
      ),
    );
  });
});

describe('safeReadJsonFile — contract', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'helpers4-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('returns null (not undefined) when no fallback is given and the file is missing', () => {
    expect(safeReadJsonFile(join(dir, 'missing.json'))).toBeNull();
  });

  it('does not throw when the path is a directory, not a file', () => {
    expect(() => safeReadJsonFile(dir)).not.toThrow();
    expect(safeReadJsonFile(dir)).toBeNull();
  });

  it('does not throw on a nonexistent nested path', () => {
    expect(() => safeReadJsonFile(join(dir, 'nested', 'missing.json'))).not.toThrow();
  });

  it('fallback reference is returned as-is (no clone)', () => {
    const fallback = { original: true };
    const result = safeReadJsonFile(join(dir, 'missing.json'), fallback);
    expect(result).toBe(fallback);
  });
});
