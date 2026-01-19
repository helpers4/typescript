/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { DIR } from "../../constants";
import { readFileText } from "../../utils";

/**
 * Analyzes the external packages used in a specific category by parsing import statements
 * @param categoryName - The name of the category (e.g., 'string', 'url', 'observable')
 * @returns Promise<string[]> - Array of external package names used in the category
 */
export async function getExternalDependencies(categoryName: string): Promise<string[]> {
  const categoryPath = join(DIR.HELPERS, categoryName);
  const files = await readdir(categoryPath);

  // Filter .ts files, ignoring .test.ts, .bench.ts, etc.
  const tsFiles = files.filter(file => file.endsWith(".ts") && !file.match(/\.\w+\.ts$/));

  const externalPackages = new Set<string>();

  for (const file of tsFiles) {
    const filePath = join(categoryPath, file);
    const content = readFileText(filePath);

    // Extract import statements
    const importRegex = /import\s+[^;]+from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];

      // Skip relative imports (starting with . or ./)
      if (importPath.startsWith('.')) {
        continue;
      }

      // Skip node built-in modules
      const builtinModules = [
        'path', 'fs', 'util', 'events', 'stream', 'buffer', 'crypto', 'url',
        'querystring', 'http', 'https', 'net', 'os', 'child_process', 'cluster',
        'dns', 'readline', 'repl', 'tls', 'dgram', 'vm', 'zlib', 'assert',
        'constants', 'domain', 'punycode', 'string_decoder', 'tty', 'v8'
      ];

      if (builtinModules.includes(importPath)) {
        continue;
      }

      // Extract package name (handle scoped packages)
      let packageName = importPath;
      if (importPath.startsWith('@')) {
        // Scoped package: @scope/package or @scope/package/subpath
        const parts = importPath.split('/');
        if (parts.length >= 2) {
          packageName = `${parts[0]}/${parts[1]}`;
        }
      } else {
        // Regular package: package or package/subpath
        packageName = importPath.split('/')[0];
      }

      // Skip if it's a TypeScript declaration file import
      if (packageName.startsWith('@types/')) {
        continue;
      }

      externalPackages.add(packageName);
    }
  }

  return Array.from(externalPackages).sort();
}
