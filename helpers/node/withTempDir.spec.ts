/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { withTempDir } from './withTempDir';

// mkdtemp rejects path separators and most punctuation in a prefix on some platforms —
// restrict to a charset that is always a valid path segment, so failures here would mean a
// real bug in withTempDir, not an OS path-naming quirk unrelated to it.
const safePrefix = fc.stringMatching(/^[a-zA-Z0-9_-]{1,20}$/);

describe('withTempDir — property-based', () => {
  it('always creates the directory under the OS temp root, named with the given prefix', async () => {
    await fc.assert(
      fc.asyncProperty(safePrefix, async (prefix) => {
        await withTempDir(prefix, async (dir) => {
          expect(dir.startsWith(tmpdir())).toBe(true);
          expect(dir).toContain(`${prefix}-`);
        });
      }),
    );
  });

  it('the directory always exists during fn and never exists after resolving', async () => {
    await fc.assert(
      fc.asyncProperty(safePrefix, async (prefix) => {
        let dirDuring = false;
        let dirPath = '';
        await withTempDir(prefix, async (dir) => {
          dirPath = dir;
          dirDuring = existsSync(dir);
        });
        expect(dirDuring).toBe(true);
        expect(existsSync(dirPath)).toBe(false);
      }),
    );
  });
});

describe('withTempDir — contract', () => {
  it('two calls with the same prefix get distinct directories', async () => {
    const dirs: string[] = [];
    await withTempDir('same-prefix', async (dir) => {
      dirs.push(dir);
    });
    await withTempDir('same-prefix', async (dir) => {
      dirs.push(dir);
    });
    expect(dirs[0]).not.toBe(dirs[1]);
  });
});
