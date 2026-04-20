/**
 * helpers4 - A collection of TypeScript/JavaScript utilities
 * Copyright (C) 2025 baxyz
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { join } from "node:path";
import { ensureDir } from "fs-extra";
import { DIR } from "../../constants";
import { readFileJson, writeFile } from "../../utils";
import { stripV } from "../../../helpers/version/stripV";

/**
 * Derive a GitHub `<owner>/<repo>` slug from a package.json `repository` field.
 * Handles both string and object forms, as well as common URL patterns:
 * - `git+https://github.com/<owner>/<repo>.git`
 * - `https://github.com/<owner>/<repo>`
 * - `git://github.com/<owner>/<repo>.git`
 * - `git@github.com:<owner>/<repo>.git` (SSH)
 * - `git+ssh://git@github.com/<owner>/<repo>.git`
 * - `github:<owner>/<repo>` (npm shorthand)
 * - `<owner>/<repo>` (bare shorthand)
 *
 * @param repository - The `repository` field from package.json.
 * @returns The `<owner>/<repo>` slug, or `undefined` when it cannot be derived.
 */
function extractGitHubSlug(repository: unknown): string | undefined {
  const raw =
    typeof repository === 'string'
      ? repository
      : (repository as Record<string, string> | undefined)?.url;

  if (!raw) return undefined;

  // npm shorthands: "github:<owner>/<repo>" or bare "<owner>/<repo>"
  const shorthand = /^(?:github:)?([\w.-]+\/[\w.-]+)$/.exec(raw);
  if (shorthand) return shorthand[1];

  // URL-based formats — match the `github.com` hostname followed by the slug
  const urlMatch = /github\.com[/:]([\w.-]+\/[\w.-]+?)(?:\.git)?(?:[/#?].*)?$/.exec(raw);
  if (urlMatch) return urlMatch[1];

  return undefined;
}

/**
 * Create metadata files for the bundle.
 * @param buildBundleDir - The build bundle directory.
 * @param categories - The list of available categories.
 */
export async function createBundleMetadata(
  buildBundleDir: string,
  categories: string[]
) {
  const metaDir = join(buildBundleDir, "meta");

  // Ensure meta directory exists
  await ensureDir(metaDir);

  // Read root package.json to get version and other info
  const rootPackage = readFileJson<Record<string, unknown>>(join(DIR.ROOT, "package.json"));

  const version = stripV(rootPackage.version as string);

  // Derive the Stryker project slug from package.json repository field so the URL
  // stays correct after any repo rename or fork without touching this file.
  // Supports both string and object forms, and multiple URL patterns.
  const mutationDashboardUrl = (() => {
    const repoSlug = extractGitHubSlug(rootPackage.repository);
    if (!repoSlug) return undefined;
    return `https://dashboard.stryker-mutator.io/reports/github.com/${repoSlug}/v${version}`;
  })();

  // Runtime compatibility — read from package.json engines field.
  // Deno and Bun are structurally compatible (ESM-only, no native addons) with no per-version constraints.
  const engines = (rootPackage.engines as Record<string, string> | undefined) ?? {};
  const runtimes = {
    node: engines.node ?? '>=24.0.0',
    deno: 'compatible',
    bun: 'compatible',
    browser: engines.browser ?? 'ES2022+',
  };

  // Create build.json with build metadata
  const buildMetadata = {
    buildDate: new Date().toISOString(),
    version,
    mutationDashboardUrl,
    runtimes,
    categories: categories.sort(),
    totalCategories: categories.length,
    buildTool: "vite",
    nodeVersion: stripV(process.version),
    platform: process.platform
  };

  writeFile(
    join(metaDir, "build.json"),
    JSON.stringify(buildMetadata, null, 2)
  );

  // Create packages.json with all package versions
  const packagesMetadata = categories.reduce<Record<string, string>>((acc, category) => {
    acc[`@helpers4/${category}`] = rootPackage.version as string;
    return acc;
  }, {
    // Include the bundle package itself
    "@helpers4/all": rootPackage.version as string
  });

  writeFile(
    join(metaDir, "packages.json"),
    JSON.stringify(packagesMetadata, null, 2)
  );
}
