/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { join } from 'node:path';
import { DIR } from '../constants';
import { readFileJson, writeFile } from '../utils';
import { getExternalDependencies } from './helpers/get-external-dependencies.helper';

interface DependencyLicense {
  readonly name: string;
  readonly license: string;
  readonly homepage?: string;
  readonly repository?: string;
}

interface CategoryLicensesJson {
  readonly category: string;
  readonly dependencies: readonly DependencyLicense[];
}

/**
 * Read license metadata from a dependency's package.json in node_modules.
 */
function readDependencyLicense(packageName: string): DependencyLicense {
  const pkgJsonPath = join(DIR.ROOT, 'node_modules', packageName, 'package.json');
  const pkg = readFileJson<Record<string, unknown>>(pkgJsonPath);

  const repository = typeof pkg.repository === 'string'
    ? pkg.repository
    : (pkg.repository as Record<string, string> | undefined)?.url;

  // Strip git+ prefix and .git suffix for clean URLs
  const cleanRepo = repository
    ?.replace(/^git\+/, '')
    ?.replace(/\.git$/, '');

  const license = typeof pkg.license === 'string'
    ? pkg.license
    : (pkg.license as Record<string, string> | undefined)?.type ?? 'UNKNOWN';

  return {
    name: packageName,
    license,
    ...(pkg.homepage ? { homepage: pkg.homepage as string } : {}),
    ...(cleanRepo ? { repository: cleanRepo } : {}),
  };
}

/**
 * Generates a `licenses.json` file in each built category directory.
 * Lists third-party dependencies with their license field from package.json.
 *
 * @param validCategories - Categories that were successfully built
 */
export async function buildLicenses(validCategories: string[]): Promise<void> {
  for (const category of validCategories) {
    const externalDeps = await getExternalDependencies(category);

    const dependencies = externalDeps.map(readDependencyLicense);

    const json: CategoryLicensesJson = { category, dependencies };
    const outputPath = join(DIR.BUILD, category, 'licenses.json');
    writeFile(outputPath, JSON.stringify(json, null, 2));
  }
}
