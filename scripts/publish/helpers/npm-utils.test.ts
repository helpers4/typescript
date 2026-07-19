/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const execMock = vi.fn();

vi.mock('node:child_process', () => {
  const exec = (...args: unknown[]) => execMock(...args);
  return { default: { exec }, exec };
});

// Import after mocking so `promisify(exec)` inside the module wraps our mock.
const { checkNpmAuth, deprecatePackage, getPackageInfo, packageVersionExists, publishPackage } = await import(
  './npm-utils'
);

/** Resolves/rejects the exec-style (command, [options], callback) call, whichever arity was used. */
function respondWith(implementation: (command: string) => { error?: Error; stdout?: string; stderr?: string }) {
  execMock.mockImplementation((command: string, optionsOrCallback: unknown, maybeCallback?: unknown) => {
    const callback = (typeof optionsOrCallback === 'function' ? optionsOrCallback : maybeCallback) as (
      error: Error | null,
      result?: { stdout: string; stderr: string },
    ) => void;
    const { error, stdout = '', stderr = '' } = implementation(command);
    if (error) callback(error);
    else callback(null, { stdout, stderr });
  });
}

describe('checkNpmAuth', () => {
  it('returns true when npm whoami succeeds', async () => {
    respondWith(() => ({ stdout: 'baxyz' }));
    expect(await checkNpmAuth()).toBe(true);
  });

  it('returns false when npm whoami fails', async () => {
    respondWith(() => ({ error: new Error('ENEEDAUTH') }));
    expect(await checkNpmAuth()).toBe(false);
  });
});

describe('packageVersionExists', () => {
  it('returns true when npm view echoes back the same version', async () => {
    respondWith(() => ({ stdout: '3.0.0\n' }));
    expect(await packageVersionExists('@helpers4/array', '3.0.0')).toBe(true);
  });

  it('returns false when npm view fails (package/version not found)', async () => {
    respondWith(() => ({ error: new Error('E404') }));
    expect(await packageVersionExists('@helpers4/array', '3.0.0')).toBe(false);
  });
});

describe('getPackageInfo', () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), 'helpers4-npm-utils-'));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('reads name and version from package.json', async () => {
    await writeFile(path.join(dir, 'package.json'), JSON.stringify({ name: '@helpers4/array', version: '3.0.0' }));
    expect(await getPackageInfo(dir)).toEqual({ name: '@helpers4/array', version: '3.0.0' });
  });

  it('throws when package.json is missing', async () => {
    await expect(getPackageInfo(dir)).rejects.toThrow('package.json not found');
  });

  it('throws when name is missing', async () => {
    await writeFile(path.join(dir, 'package.json'), JSON.stringify({ version: '3.0.0' }));
    await expect(getPackageInfo(dir)).rejects.toThrow('Package name not found');
  });

  it('throws when version is missing', async () => {
    await writeFile(path.join(dir, 'package.json'), JSON.stringify({ name: '@helpers4/array' }));
    await expect(getPackageInfo(dir)).rejects.toThrow('Package version not found');
  });
});

describe('publishPackage', () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), 'helpers4-npm-utils-publish-'));
    await writeFile(path.join(dir, 'package.json'), JSON.stringify({ name: '@helpers4/array', version: '3.0.0' }));
    execMock.mockReset();
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('skips when the version is already published', async () => {
    respondWith(() => ({ stdout: '3.0.0' })); // npm view echoes the same version → "exists"
    const result = await publishPackage(dir, { retries: 3 });
    expect(result).toMatchObject({ skipped: true, success: true, version: '3.0.0' });
    // Only the "does it exist" check should run — no publish attempt.
    expect(execMock).toHaveBeenCalledTimes(1);
  });

  it('builds the npm publish command with the requested flags', async () => {
    let publishCommand = '';
    respondWith((command) => {
      if (command.startsWith('npm view')) return { error: new Error('E404') }; // not published yet
      publishCommand = command;
      return { stdout: '' };
    });

    await publishPackage(dir, { access: 'public', tag: 'alpha', provenance: true, registry: 'https://registry.example' });

    expect(publishCommand).toBe(
      'npm publish --access public --tag alpha --registry https://registry.example --provenance',
    );
  });

  it('does not shell out to npm publish in dry-run mode', async () => {
    respondWith((command) => (command.startsWith('npm view') ? { error: new Error('E404') } : { stdout: '' }));
    const result = await publishPackage(dir, { dryRun: true });
    expect(result.success).toBe(true);
    // Only the version-exists check ran; the publish step was logged, not executed.
    expect(execMock).toHaveBeenCalledTimes(1);
  });

  it('retries on failure and succeeds if a later attempt works', async () => {
    let attempts = 0;
    respondWith((command) => {
      if (command.startsWith('npm view')) return { error: new Error('E404') };
      attempts++;
      return attempts < 2 ? { error: new Error('network blip') } : { stdout: '' };
    });

    const result = await publishPackage(dir, { retries: 3, retryDelay: 0 });
    expect(result.success).toBe(true);
    expect(attempts).toBe(2);
  });

  it('fails after exhausting all retries', async () => {
    respondWith((command) =>
      command.startsWith('npm view') ? { error: new Error('E404') } : { error: new Error('registry down') },
    );

    const result = await publishPackage(dir, { retries: 2, retryDelay: 0 });
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe('registry down');
  });
});

describe('deprecatePackage', () => {
  it('returns true on success', async () => {
    respondWith(() => ({ stdout: '' }));
    expect(await deprecatePackage('@helpers4/array', '3.0.0')).toBe(true);
  });

  it('returns false when the deprecate command fails', async () => {
    respondWith(() => ({ error: new Error('E404') }));
    expect(await deprecatePackage('@helpers4/array', '3.0.0')).toBe(false);
  });
});
