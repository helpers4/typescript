/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { withTempDir } from './withTempDir';

describe('withTempDir', () => {
  it('creates a directory and passes its path to fn', async () => {
    let receivedDir = '';
    await withTempDir('helpers4-test', async (dir) => {
      receivedDir = dir;
      expect(existsSync(dir)).toBe(true);
    });
    expect(receivedDir).toContain('helpers4-test-');
  });

  it('returns whatever fn resolves to', async () => {
    const result = await withTempDir('helpers4-test', async (dir) => {
      await writeFile(`${dir}/output.txt`, 'data');
      return readFile(`${dir}/output.txt`, 'utf-8');
    });
    expect(result).toBe('data');
  });

  it('removes the directory after fn resolves', async () => {
    let dirPath = '';
    await withTempDir('helpers4-test', async (dir) => {
      dirPath = dir;
    });
    expect(existsSync(dirPath)).toBe(false);
  });

  it('removes the directory even when fn throws, and re-throws fn\'s error', async () => {
    let dirPath = '';
    await expect(
      withTempDir('helpers4-test', async (dir) => {
        dirPath = dir;
        throw new Error('boom');
      }),
    ).rejects.toThrow('boom');
    expect(existsSync(dirPath)).toBe(false);
  });
});
