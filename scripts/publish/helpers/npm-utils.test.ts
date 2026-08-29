/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { EventEmitter } from 'node:events';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const execMock = vi.fn();
const execFileMock = vi.fn();
const spawnMock = vi.fn();

vi.mock('node:child_process', () => {
  const exec = (...args: unknown[]) => execMock(...args);
  const execFile = (...args: unknown[]) => execFileMock(...args);
  const spawn = (...args: unknown[]) => spawnMock(...args);
  return { default: { exec, execFile, spawn }, exec, execFile, spawn };
});

// Import after mocking so `promisify(exec)`/`promisify(execFile)` inside the module wrap our mocks.
const { checkNpmAuth, deprecatePackage, getPackageInfo, packageVersionExists, publishPackage, unpublishPackage } =
  await import('./npm-utils');

// Clears call history (not implementations) before every test, so a test asserting
// "the other mock was never called" isn't tripped up by an unrelated earlier test's calls.
beforeEach(() => {
  execMock.mockClear();
  execFileMock.mockClear();
  spawnMock.mockClear();
});

/**
 * `spawn()` returns an EventEmitter-based child process, not a callback — makes `spawnMock`
 * return a fake one and fires 'close' (or 'error') on the next microtask, matching how a real
 * child process would emit asynchronously.
 */
function respondToSpawnWith(outcome: { code?: number; error?: Error }) {
  spawnMock.mockImplementation(() => {
    const child = new EventEmitter();
    queueMicrotask(() => {
      if (outcome.error) child.emit('error', outcome.error);
      else child.emit('close', outcome.code ?? 0);
    });
    return child;
  });
}

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

/**
 * Resolves/rejects an execFile-style (file, args, [options], callback) call.
 *
 * The real `child_process.execFile`'s raw callback receives `stdout`/`stderr` as separate
 * positional arguments, but it also carries a `util.promisify.custom` implementation that
 * bundles them into one `{ stdout, stderr }` object for `promisify(execFile)` callers — this
 * mock has no such custom symbol, so generic `util.promisify` behavior applies instead: it
 * resolves with only the *first* non-error callback argument, discarding the rest. Passing a
 * single combined `{ stdout, stderr }` object as that one argument (exactly like `respondWith`
 * already does for `exec`, immediately above) reproduces the real, custom-promisified shape
 * `packageVersionExists`'s `await execFileAsync(...)` expects to destructure.
 */
function respondToExecFileWith(implementation: (file: string, args: string[]) => { error?: Error; stdout?: string; stderr?: string }) {
  execFileMock.mockImplementation((file: string, args: string[], optionsOrCallback: unknown, maybeCallback?: unknown) => {
    const callback = (typeof optionsOrCallback === 'function' ? optionsOrCallback : maybeCallback) as (
      error: Error | null,
      result?: { stdout: string; stderr: string },
    ) => void;
    const { error, stdout = '', stderr = '' } = implementation(file, args);
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
    respondToExecFileWith(() => ({ stdout: '3.0.0\n' }));
    expect(await packageVersionExists('@helpers4/array', '3.0.0')).toBe(true);
  });

  it('returns false when npm view fails (package/version not found)', async () => {
    respondToExecFileWith(() => ({ error: new Error('E404') }));
    expect(await packageVersionExists('@helpers4/array', '3.0.0')).toBe(false);
  });

  it('passes packageName@version as a single argv element via execFile, not a shell command string (regression: command-injection guard)', async () => {
    respondToExecFileWith(() => ({ stdout: '3.0.0\n' }));
    await packageVersionExists('@helpers4/array', '3.0.0; touch /tmp/pwned');

    expect(execFileMock).toHaveBeenCalledWith(
      'npm',
      ['view', '@helpers4/array@3.0.0; touch /tmp/pwned', 'version', '--silent'],
      expect.any(Function),
    );
    expect(execMock).not.toHaveBeenCalled();
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
    execFileMock.mockReset();
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('skips when the version is already published', async () => {
    respondToExecFileWith(() => ({ stdout: '3.0.0' })); // npm view echoes the same version → "exists"
    const result = await publishPackage(dir, { retries: 3 });
    expect(result).toMatchObject({ skipped: true, success: true, version: '3.0.0' });
    // Only the "does it exist" check should run — no publish attempt.
    expect(execFileMock).toHaveBeenCalledTimes(1);
    expect(execMock).not.toHaveBeenCalled();
  });

  it('builds the npm publish command with the requested flags', async () => {
    respondToExecFileWith(() => ({ error: new Error('E404') })); // not published yet
    let publishCommand = '';
    respondWith((command) => {
      publishCommand = command;
      return { stdout: '' };
    });

    await publishPackage(dir, { access: 'public', tag: 'alpha', provenance: true, registry: 'https://registry.example' });

    expect(publishCommand).toBe(
      'npm publish --access public --tag alpha --registry https://registry.example --provenance',
    );
  });

  it('does not shell out to npm publish in dry-run mode', async () => {
    respondToExecFileWith(() => ({ error: new Error('E404') }));
    const result = await publishPackage(dir, { dryRun: true });
    expect(result.success).toBe(true);
    // Only the version-exists check ran; the publish step was logged, not executed.
    expect(execFileMock).toHaveBeenCalledTimes(1);
    expect(execMock).not.toHaveBeenCalled();
  });

  it('retries on failure and succeeds if a later attempt works', async () => {
    respondToExecFileWith(() => ({ error: new Error('E404') }));
    let attempts = 0;
    respondWith(() => {
      attempts++;
      return attempts < 2 ? { error: new Error('network blip') } : { stdout: '' };
    });

    const result = await publishPackage(dir, { retries: 3, retryDelay: 0 });
    expect(result.success).toBe(true);
    expect(attempts).toBe(2);
  });

  it('fails after exhausting all retries', async () => {
    respondToExecFileWith(() => ({ error: new Error('E404') }));
    respondWith(() => ({ error: new Error('registry down') }));

    const result = await publishPackage(dir, { retries: 2, retryDelay: 0 });
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe('registry down');
  });
});

describe('unpublishPackage', () => {
  it('skips when the version was never published, without spawning npm', async () => {
    respondToExecFileWith(() => ({ error: new Error('E404') }));
    const result = await unpublishPackage('@helpers4/structure', '3.0.8');
    expect(result).toMatchObject({ success: true, skipped: true, skipReason: 'Version not published, nothing to unpublish' });
    expect(spawnMock).not.toHaveBeenCalled();
  });

  it('resolves success when npm unpublish exits with code 0', async () => {
    respondToExecFileWith(() => ({ stdout: '3.0.8\n' }));
    respondToSpawnWith({ code: 0 });

    const result = await unpublishPackage('@helpers4/array', '3.0.8');

    expect(result).toMatchObject({ success: true, packageName: '@helpers4/array', version: '3.0.8' });
    expect(spawnMock).toHaveBeenCalledWith('npm', ['unpublish', '@helpers4/array@3.0.8'], { stdio: 'inherit' });
  });

  it('resolves failure when npm unpublish exits with a non-zero code', async () => {
    respondToExecFileWith(() => ({ stdout: '3.0.8\n' }));
    respondToSpawnWith({ code: 1 });

    const result = await unpublishPackage('@helpers4/array', '3.0.8');

    expect(result.success).toBe(false);
    expect(result.error?.message).toMatch(/exited with code 1/);
  });

  it('resolves failure when the spawn itself errors (e.g. npm not found)', async () => {
    respondToExecFileWith(() => ({ stdout: '3.0.8\n' }));
    respondToSpawnWith({ error: new Error('spawn npm ENOENT') });

    const result = await unpublishPackage('@helpers4/array', '3.0.8');

    expect(result.success).toBe(false);
    expect(result.error?.message).toBe('spawn npm ENOENT');
  });

  it('passes --otp and --registry through to the npm unpublish command', async () => {
    respondToExecFileWith(() => ({ stdout: '3.0.8\n' }));
    respondToSpawnWith({ code: 0 });

    await unpublishPackage('@helpers4/array', '3.0.8', { otp: '123456', registry: 'https://registry.example' });

    expect(spawnMock).toHaveBeenCalledWith(
      'npm',
      ['unpublish', '@helpers4/array@3.0.8', '--registry', 'https://registry.example', '--otp', '123456'],
      { stdio: 'inherit' },
    );
  });

  it('does not spawn npm in dry-run mode', async () => {
    respondToExecFileWith(() => ({ stdout: '3.0.8\n' }));
    const result = await unpublishPackage('@helpers4/array', '3.0.8', { dryRun: true });
    expect(result).toMatchObject({ success: true, skipped: true, skipReason: 'dry-run' });
    expect(spawnMock).not.toHaveBeenCalled();
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
