/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { parseDependencies } from '@helpers4/package';
import { RUN, consume } from '../../scripts/bench';

const SMALL = 'libc6 (>= 2.14)';
const FULL = 'libc6 (>= 2.34), python3:any | python3 (>= 3.8) [amd64], foo <!nocheck>';
const LARGE = Array.from({ length: 200 }, (_, index) => `libpackage${index} (>= 1.${index}) | other${index}`).join(',\n ');

const entries = (write: (index: number) => string, separator: string) => Array.from({ length: 200 }, (_, index) => write(index)).join(separator);
const RPM = entries((index) => `libpackage${index} >= 1.${index}`, ', ');
const ARCH = entries((index) => `libpackage${index}>=1.${index}`, ' ');
const ALPINE = entries((index) => `libpackage${index}>=1.${index}`, ' ');
const PEP508 = entries((index) => `package${index}[extra]>=1.${index},<2 ; python_version < "3.12"`, '\n');

test('parseDependencies', async ({ bench }) => {
  await bench.compare(
    bench('one versioned package', () => {
      consume(parseDependencies(SMALL, 'debian'));
    }),
    bench('every kind of part', () => {
      consume(parseDependencies(FULL, 'debian'));
    }),
    bench('200 entries with alternatives', () => {
      consume(parseDependencies(LARGE, 'debian'));
    }),
    bench('rpm: 200 entries', () => {
      consume(parseDependencies(RPM, 'rpm'));
    }),
    bench('arch: 200 entries', () => {
      consume(parseDependencies(ARCH, 'arch'));
    }),
    bench('alpine: 200 entries', () => {
      consume(parseDependencies(ALPINE, 'alpine'));
    }),
    bench('pep508: 200 requirements', () => {
      consume(parseDependencies(PEP508, 'pep508'));
    }),
    RUN,
  );
});
