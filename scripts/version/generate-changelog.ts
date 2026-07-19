#!/usr/bin/env node

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { execFile } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const CHANGELOG_PATH = 'CHANGELOG.md';
const RELEASE_HEADING_PATTERN = /^## \[/gm;
const LEADING_NEWLINE_PATTERN = /^\n/;

function normalizeChangelogSpacing(content: string): string {
  return content
    .replace(RELEASE_HEADING_PATTERN, '\n## [')
    .replace(LEADING_NEWLINE_PATTERN, '');
}

// `pnpm run changelog -- --tag v3.0.2` forwards a literal leading `--` into this script's
// argv (npm/pnpm's own args-follow separator, not meant for git-cliff) — passing it through
// verbatim makes git-cliff treat everything after it as positional args instead of flags.
function stripLeadingArgSeparator(args: string[]): string[] {
  return args[0] === '--' ? args.slice(1) : args;
}

async function generateChangelog(): Promise<void> {
  const cliArgs = stripLeadingArgSeparator(process.argv.slice(2));
  await execFileAsync('git-cliff', ['-o', CHANGELOG_PATH, ...cliArgs]);

  const content = await readFile(CHANGELOG_PATH, 'utf8');
  await writeFile(CHANGELOG_PATH, normalizeChangelogSpacing(content));
}

generateChangelog().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
