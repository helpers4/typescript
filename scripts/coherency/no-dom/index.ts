#!/usr/bin/env node

/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * No-DOM coherency test
 *
 * A category outside `browser` and `node` must work on every runtime, so its published
 * `index.d.ts` has to compile with no DOM lib and no Node types: a consumer in GJS or any other
 * runtime without them would otherwise get `Cannot find name '…'` from the library's own types.
 */

import { execFileSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

/** Categories that are allowed to name runtime types, and the reason. */
const EXEMPT: Record<string, string> = {
  browser: 'DOM APIs by design',
  node: 'Node.js APIs by design',
  guard: 'isBlob and isFormData name Blob and FormData',
  promise: 'fetchJson, fetchOrThrow and safeFetch name RequestInit, Response and URL',
  url: 'isExternal names URL',
};

const BUILD = path.resolve('build');

function errorsOf(category: string): string[] {
  const entry = path.join(BUILD, category, 'lib', 'index.d.ts');
  try {
    execFileSync('pnpm', ['exec', 'tsc', '--ignoreConfig', '--noEmit', '--strict', '--lib', 'esnext', '--types', '', entry], {
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return [];
  } catch (error) {
    const { stdout = '' } = error as { stdout?: string };
    // Only the package's own declarations count: a dependency's types are its own business.
    return stdout.split('\n').filter((line) => line.startsWith(path.relative(process.cwd(), BUILD)) && line.includes('error TS'));
  }
}

function runNoDomTest(): void {
  console.log('🧪 No-DOM Coherency:');
  console.log('   Checks that category declarations compile without the DOM lib or Node types');

  const categories = fs
    .readdirSync(BUILD, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(BUILD, entry.name, 'lib', 'index.d.ts')))
    .map((entry) => entry.name)
    .filter((name) => name !== 'all' && name !== 'helpers4' && name !== 'presets');

  const failures: string[] = [];
  for (const category of categories) {
    if (category in EXEMPT) continue;
    for (const line of errorsOf(category)) failures.push(line);
  }

  if (failures.length > 0) {
    throw new Error(`declarations that need DOM or Node types:\n${failures.map((f) => `   ${f}`).join('\n')}`);
  }
  console.log(`   ${categories.length - Object.keys(EXEMPT).length} categories checked, ${Object.keys(EXEMPT).length} exempt`);
}

try {
  runNoDomTest();
  console.log('✅ No-DOM Coherency passed');
} catch (error) {
  console.error('❌ No-DOM Coherency failed:', error instanceof Error ? error.message : error);
  process.exit(1);
}
