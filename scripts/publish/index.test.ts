/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { parseArgs } from './index';

const originalArgv = process.argv;

function withArgs(args: string[]): void {
  process.argv = [originalArgv[0]!, originalArgv[1]!, ...args];
}

beforeEach(() => {
  process.argv = originalArgv;
});

afterEach(() => {
  process.argv = originalArgv;
});

describe('parseArgs', () => {
  it('defaults to latest tag, public access, 3 retries, no dry-run', () => {
    withArgs([]);
    expect(parseArgs()).toMatchObject({ tag: 'latest', access: 'public', dryRun: false, retries: 3 });
  });

  it('parses --tag', () => {
    withArgs(['--tag', 'alpha']);
    expect(parseArgs().tag).toBe('alpha');
  });

  it('parses --dry-run', () => {
    withArgs(['--dry-run']);
    expect(parseArgs().dryRun).toBe(true);
  });

  it('converts --category-delay and --retry-delay from seconds to milliseconds', () => {
    withArgs(['--category-delay', '30', '--retry-delay', '10']);
    const config = parseArgs();
    expect(config.categoryDelay).toBe(30_000);
    expect(config.retryDelay).toBe(10_000);
  });

  it('parses --retries as a number', () => {
    withArgs(['--retries', '5']);
    expect(parseArgs().retries).toBe(5);
  });

  it('parses --access and --registry', () => {
    withArgs(['--access', 'restricted', '--registry', 'https://registry.example']);
    const config = parseArgs();
    expect(config.access).toBe('restricted');
    expect(config.registry).toBe('https://registry.example');
  });
});
