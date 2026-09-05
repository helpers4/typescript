/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * Creates a fresh temporary directory under the OS temp root, runs `fn` with its path, and
 * always removes it (recursively) afterward — including when `fn` throws.
 * @param prefix - Prepended to the generated directory name, to make it identifiable
 * @param fn - Receives the temp directory's absolute path; its (possibly synchronous) return
 * value is returned
 * @returns Whatever `fn` returns or resolves to
 * @example
 * await withTempDir('my-tool', async (dir) => {
 *   await writeFile(`${dir}/output.txt`, 'data');
 *   return readFile(`${dir}/output.txt`, 'utf-8');
 * });
 * // => 'data' (the directory no longer exists once this resolves)
 * @since next
 */
export async function withTempDir<T>(prefix: string, fn: (dir: string) => T | Promise<T>): Promise<T> {
  const dir = await mkdtemp(join(tmpdir(), `${prefix}-`));
  try {
    return await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
