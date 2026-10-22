/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  incrementVersion,
  parseVersion,
  stringifyVersion,
  updateAllPackageVersions,
  updatePackageVersion,
} from './version-manager';

describe('parseVersion', () => {
  it('parses a stable version', () => {
    expect(parseVersion('3.0.0')).toEqual({ major: 3, minor: 0, patch: 0 });
  });

  it('parses a prerelease version', () => {
    expect(parseVersion('3.0.0-alpha.2')).toEqual({
      major: 3,
      minor: 0,
      patch: 0,
      prerelease: { type: 'alpha', version: 2 },
    });
  });

  it('throws on an invalid version string', () => {
    expect(() => parseVersion('not-a-version')).toThrow('Invalid version format');
  });
});

describe('stringifyVersion', () => {
  it('round-trips a stable version', () => {
    expect(stringifyVersion({ major: 3, minor: 0, patch: 0 })).toBe('3.0.0');
  });

  it('round-trips a prerelease version', () => {
    expect(stringifyVersion({ major: 3, minor: 0, patch: 0, prerelease: { type: 'alpha', version: 2 } })).toBe(
      '3.0.0-alpha.2',
    );
  });
});

describe('incrementVersion', () => {
  // Regression coverage for the 2026-07-18 incident: a manual `major` dispatch on
  // 3.0.0-alpha.2 produced 4.0.0 (bump major AND drop prerelease) instead of the intended
  // 3.0.0 (which `patch` — not `major` — produces on a prerelease, see below). The behavior
  // itself was correct all along; the incident was a wrong release_type choice, not a bug —
  // these tests just pin down that documented-but-previously-unverified behavior.
  describe('major', () => {
    it('bumps major and resets minor/patch on a stable version', () => {
      expect(incrementVersion('2.1.0', 'major')).toBe('3.0.0');
    });

    it('bumps major and drops the prerelease tag', () => {
      expect(incrementVersion('3.0.0-alpha.2', 'major')).toBe('4.0.0');
    });
  });

  describe('minor', () => {
    it('bumps minor and resets patch on a stable version', () => {
      expect(incrementVersion('2.1.4', 'minor')).toBe('2.2.0');
    });

    it('bumps minor and drops the prerelease tag', () => {
      expect(incrementVersion('3.0.0-alpha.2', 'minor')).toBe('3.1.0');
    });
  });

  describe('patch', () => {
    it('bumps patch on a stable version', () => {
      expect(incrementVersion('2.1.0', 'patch')).toBe('2.1.1');
    });

    it('finalizes a prerelease WITHOUT bumping the version number', () => {
      // This is the "graduate alpha to stable" path — 3.0.0-alpha.2 -> 3.0.0, not 3.0.1.
      expect(incrementVersion('3.0.0-alpha.2', 'patch')).toBe('3.0.0');
    });
  });

  describe('prerelease', () => {
    it('adds a new prerelease to a stable version, defaulting to alpha', () => {
      expect(incrementVersion('2.1.0', 'prerelease')).toBe('2.1.0-alpha.0');
    });

    it('increments the counter for the same prerelease type', () => {
      expect(incrementVersion('3.0.0-alpha.2', 'prerelease')).toBe('3.0.0-alpha.3');
    });

    it('resets the counter when switching prerelease type', () => {
      expect(incrementVersion('3.0.0-alpha.2', 'prerelease', 'beta')).toBe('3.0.0-beta.0');
    });

    it('defaults to alpha when no prereleaseId is given and none exists yet', () => {
      expect(incrementVersion('2.1.0', 'prerelease', undefined)).toBe('2.1.0-alpha.0');
    });
  });

  it('throws on an unknown version type', () => {
    // @ts-expect-error deliberately invalid input
    expect(() => incrementVersion('2.1.0', 'bogus')).toThrow('Invalid version type');
  });
});

describe('updatePackageVersion', () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), 'helpers4-version-manager-'));
    await writeFile(path.join(dir, 'package.json'), JSON.stringify({ name: 'pkg', version: '1.0.0' }));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('writes the new version to package.json', async () => {
    await updatePackageVersion(dir, '1.1.0');
    const pkg = JSON.parse(await readFile(path.join(dir, 'package.json'), 'utf8'));
    expect(pkg.version).toBe('1.1.0');
  });

  it('does not write anything in dry-run mode', async () => {
    await updatePackageVersion(dir, '1.1.0', true);
    const pkg = JSON.parse(await readFile(path.join(dir, 'package.json'), 'utf8'));
    expect(pkg.version).toBe('1.0.0');
  });

  it('throws when package.json does not exist', async () => {
    await expect(updatePackageVersion(path.join(dir, 'missing'), '1.1.0')).rejects.toThrow('package.json not found');
  });
});

describe('updateAllPackageVersions', () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), 'helpers4-version-manager-root-'));
    await writeFile(path.join(dir, 'package.json'), JSON.stringify({ name: 'root', version: '2.1.0' }));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('bumps the root package and reports old/new version', async () => {
    const result = await updateAllPackageVersions({ rootPath: dir, versionType: 'patch', updateBuildPackages: false });
    expect(result).toEqual({ oldVersion: '2.1.0', newVersion: '2.1.1', versionType: 'patch' });

    const pkg = JSON.parse(await readFile(path.join(dir, 'package.json'), 'utf8'));
    expect(pkg.version).toBe('2.1.1');
  });

  it('also bumps every build/ sub-package when present', async () => {
    const arrayPkgDir = path.join(dir, 'build', 'array');
    await mkdir(arrayPkgDir, { recursive: true });
    await writeFile(path.join(arrayPkgDir, 'package.json'), JSON.stringify({ name: '@helpers4/array', version: '2.1.0' }));

    await updateAllPackageVersions({ rootPath: dir, versionType: 'minor' });

    const rootPkg = JSON.parse(await readFile(path.join(dir, 'package.json'), 'utf8'));
    const arrayPkg = JSON.parse(await readFile(path.join(arrayPkgDir, 'package.json'), 'utf8'));
    expect(rootPkg.version).toBe('2.2.0');
    expect(arrayPkg.version).toBe('2.2.0');
  });

  it('throws when neither an explicit version type nor auto-calculate is given', async () => {
    await expect(updateAllPackageVersions({ rootPath: dir })).rejects.toThrow(
      'Version type must be provided or auto-calculation must be enabled',
    );
  });

  it('throws when root package.json is missing', async () => {
    const emptyDir = await mkdtemp(path.join(tmpdir(), 'helpers4-version-manager-empty-'));
    try {
      await expect(updateAllPackageVersions({ rootPath: emptyDir, versionType: 'patch' })).rejects.toThrow(
        'Root package.json not found',
      );
    } finally {
      await rm(emptyDir, { recursive: true, force: true });
    }
  });
});
