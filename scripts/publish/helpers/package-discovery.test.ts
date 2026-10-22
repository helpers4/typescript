/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  type PackageMetadata,
  discoverPackages,
  groupPackagesByType,
  sortPackagesForPublishing,
  validatePackageStructure,
} from './package-discovery';

async function writePackage(
  dir: string,
  name: string,
  extra: Record<string, unknown> = {},
): Promise<string> {
  const pkgDir = path.join(dir, name === '@helpers4/all' ? 'all' : name === 'helpers4' ? 'helpers4' : name.replace('@helpers4/', ''));
  await mkdir(pkgDir, { recursive: true });
  await writeFile(path.join(pkgDir, 'package.json'), JSON.stringify({ name, version: '3.0.0', ...extra }));
  return pkgDir;
}

describe('discoverPackages', () => {
  let buildDir: string;

  beforeEach(async () => {
    buildDir = await mkdtemp(path.join(tmpdir(), 'helpers4-package-discovery-'));
  });

  afterEach(async () => {
    await rm(buildDir, { recursive: true, force: true });
  });

  it('throws when the build directory does not exist', async () => {
    await expect(discoverPackages(path.join(buildDir, 'missing'))).rejects.toThrow('Build directory not found');
  });

  it('discovers category and bundle packages, tagging isBundle correctly', async () => {
    await writePackage(buildDir, '@helpers4/array', { dependencies: { '@helpers4/guard': '3.0.0' } });
    await writePackage(buildDir, '@helpers4/all', { peerDependencies: { rxjs: '^7.0.0' } });

    const packages = await discoverPackages(buildDir);
    const array = packages.find(p => p.name === '@helpers4/array')!;
    const all = packages.find(p => p.name === '@helpers4/all')!;

    expect(array).toMatchObject({ isBundle: false, isCategory: true, version: '3.0.0', dependencies: ['@helpers4/guard'] });
    expect(all).toMatchObject({ isBundle: true, isCategory: false, dependencies: ['rxjs'] });
  });

  it('tags the unified helpers4 package as a bundle too, with real (not peer) dependencies', async () => {
    await writePackage(buildDir, 'helpers4', { dependencies: { '@helpers4/array': '3.0.0' } });

    const packages = await discoverPackages(buildDir);
    const unified = packages.find(p => p.name === 'helpers4')!;

    expect(unified).toMatchObject({ isBundle: true, isCategory: false, dependencies: ['@helpers4/array'] });
  });

  it('skips directories without a package.json instead of failing', async () => {
    await mkdir(path.join(buildDir, 'not-a-package'), { recursive: true });
    await writePackage(buildDir, '@helpers4/array');

    const packages = await discoverPackages(buildDir);
    expect(packages).toHaveLength(1);
    expect(packages[0]!.name).toBe('@helpers4/array');
  });

  it('skips files at the top level of the build directory', async () => {
    await writeFile(path.join(buildDir, 'README.md'), 'not a package');
    await writePackage(buildDir, '@helpers4/array');

    const packages = await discoverPackages(buildDir);
    expect(packages).toHaveLength(1);
  });
});

describe('sortPackagesForPublishing', () => {
  const pkg = (name: string, isBundle: boolean): PackageMetadata => ({
    name,
    version: '3.0.0',
    path: name,
    isCategory: !isBundle,
    isBundle,
    dependencies: [],
  });

  it('always places the bundle package last', () => {
    const sorted = sortPackagesForPublishing([pkg('@helpers4/all', true), pkg('@helpers4/array', false)]);
    expect(sorted.map(p => p.name)).toEqual(['@helpers4/array', '@helpers4/all']);
  });

  it('sorts category packages alphabetically', () => {
    const sorted = sortPackagesForPublishing([pkg('@helpers4/url', false), pkg('@helpers4/array', false)]);
    expect(sorted.map(p => p.name)).toEqual(['@helpers4/array', '@helpers4/url']);
  });
});

describe('groupPackagesByType', () => {
  it('splits packages into categories and bundles', () => {
    const array: PackageMetadata = { name: '@helpers4/array', version: '3.0.0', path: 'array', isCategory: true, isBundle: false, dependencies: [] };
    const all: PackageMetadata = { name: '@helpers4/all', version: '3.0.0', path: 'all', isCategory: false, isBundle: true, dependencies: [] };

    expect(groupPackagesByType([array, all])).toEqual({ categories: [array], bundles: [all] });
  });
});

describe('validatePackageStructure', () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), 'helpers4-package-validate-'));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  async function makeValidCategoryPackage(): Promise<void> {
    await writeFile(
      path.join(dir, 'package.json'),
      JSON.stringify({ name: '@helpers4/array', version: '3.0.0', description: 'd', license: 'LGPL-3.0-or-later', main: 'lib/index.js', types: 'lib/index.d.ts', exports: {} }),
    );
    await writeFile(path.join(dir, 'README.md'), '# readme');
    await writeFile(path.join(dir, 'LICENSE.md'), 'license');
    await mkdir(path.join(dir, 'lib'), { recursive: true });
    await writeFile(path.join(dir, 'lib', 'index.js'), '');
    await writeFile(path.join(dir, 'lib', 'index.d.ts'), '');
  }

  it('reports no issues for a well-formed category package', async () => {
    await makeValidCategoryPackage();
    expect(await validatePackageStructure(dir, false)).toEqual([]);
  });

  it('flags missing required top-level files', async () => {
    const issues = await validatePackageStructure(dir, false);
    expect(issues).toContain('Missing required file: package.json');
    expect(issues).toContain('Missing required file: README.md');
    expect(issues).toContain('Missing required file: LICENSE.md');
  });

  it('flags missing package.json fields', async () => {
    await writeFile(path.join(dir, 'package.json'), JSON.stringify({ name: '@helpers4/array' }));
    const issues = await validatePackageStructure(dir, false);
    expect(issues).toContain('Missing required field in package.json: version');
    expect(issues).toContain('Missing required field in package.json: description');
    expect(issues).toContain('Missing required field in package.json: license');
  });

  it('requires main/types/exports and a non-empty lib/ for category packages', async () => {
    await writeFile(
      path.join(dir, 'package.json'),
      JSON.stringify({ name: '@helpers4/array', version: '3.0.0', description: 'd', license: 'LGPL-3.0-or-later' }),
    );
    const issues = await validatePackageStructure(dir, false);
    expect(issues).toContain('Missing required field in package.json: main');
    expect(issues).toContain('Missing required field in package.json: types');
    expect(issues).toContain('Missing exports field in package.json');
    expect(issues).toContain('Missing lib directory');
  });

  it('requires a non-empty meta/ directory for bundle packages instead of lib/', async () => {
    await writeFile(
      path.join(dir, 'package.json'),
      JSON.stringify({ name: '@helpers4/all', version: '3.0.0', description: 'd', license: 'LGPL-3.0-or-later' }),
    );
    await writeFile(path.join(dir, 'README.md'), '# readme');
    await writeFile(path.join(dir, 'LICENSE.md'), 'license');

    const issues = await validatePackageStructure(dir, true);
    expect(issues).toContain('Missing meta directory');
    // Bundle packages are not held to the category main/types/exports/lib bar
    expect(issues).not.toContain('Missing required field in package.json: main');
  });

  it('flags an invalid package.json', async () => {
    await writeFile(path.join(dir, 'package.json'), 'not json');
    const issues = await validatePackageStructure(dir, false);
    expect(issues.some(issue => issue.startsWith('Invalid package.json:'))).toBe(true);
  });
});
