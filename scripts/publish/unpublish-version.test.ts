/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { parseArgs } from './unpublish-version';

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
  it('accepts the version as a bare positional argument', () => {
    withArgs(['3.0.8']);
    expect(parseArgs()).toMatchObject({ version: '3.0.8', dryRun: false });
  });

  it('accepts --version explicitly', () => {
    withArgs(['--version', '3.0.8']);
    expect(parseArgs().version).toBe('3.0.8');
  });

  it('parses --dry-run', () => {
    withArgs(['3.0.8', '--dry-run']);
    expect(parseArgs().dryRun).toBe(true);
  });

  it('parses --otp', () => {
    withArgs(['3.0.8', '--otp', '123456']);
    expect(parseArgs().otp).toBe('123456');
  });

  it('parses --registry', () => {
    withArgs(['3.0.8', '--registry', 'https://registry.example']);
    expect(parseArgs().registry).toBe('https://registry.example');
  });

  it('accepts options before the positional version', () => {
    withArgs(['--dry-run', '--otp', '123456', '3.0.8']);
    expect(parseArgs()).toMatchObject({ version: '3.0.8', dryRun: true, otp: '123456' });
  });
});
