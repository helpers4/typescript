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
import { parsePackageRepository } from "../../../helpers/url/parsePackageRepository";

/**
 * Create meta/build.json and meta/packages.json for a package that collects every
 * category (the @helpers4/all bundle and the helpers4 unified package). Shared so the
 * two collections can never drift on how this metadata is computed.
 * @param buildCollectionDir - The build directory of the collecting package.
 * @param categories - The list of available categories.
 * @param selfPackageName - The npm name of the collecting package itself, included in packages.json.
 */
export async function createCollectionMetadata(
  buildCollectionDir: string,
  categories: string[],
  selfPackageName: string
) {
  const metaDir = join(buildCollectionDir, "meta");

  // Ensure meta directory exists
  await ensureDir(metaDir);

  // Read root package.json to get version and other info
  const rootPackage = readFileJson<Record<string, unknown>>(join(DIR.ROOT, "package.json"));

  const version = stripV(rootPackage.version as string);

  // Derive the Stryker project slug from package.json repository field so the URL
  // stays correct after any repo rename or fork without touching this file.
  // Supports both string and object forms, and multiple URL patterns.
  const mutationDashboardUrl = (() => {
    const parsed = parsePackageRepository(rootPackage.repository);
    if (parsed?.host !== 'github' || !parsed.slug) return undefined;
    return `https://dashboard.stryker-mutator.io/reports/github.com/${parsed.slug}/v${version}`;
  })();

  // Consumer runtime compatibility — read from package.json "runtimes" field (not "engines",
  // which tracks the dev/build tooling requirement and may be higher than the consumer minimum).
  const runtimesField = (rootPackage.runtimes as Record<string, string> | undefined) ?? {};
  const runtimes = {
    node: runtimesField.node ?? '>=20.0.0',
    deno: 'compatible',
    bun: 'compatible',
    browser: runtimesField.browser ?? 'ES2022+',
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
    // Include the collecting package itself
    [selfPackageName]: rootPackage.version as string
  });

  writeFile(
    join(metaDir, "packages.json"),
    JSON.stringify(packagesMetadata, null, 2)
  );
}
