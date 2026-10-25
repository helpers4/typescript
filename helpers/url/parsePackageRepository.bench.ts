/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { parsePackageRepository } from '@helpers4/url';
import { RUN, consume } from '../../scripts/bench';

test('parsePackageRepository', async ({ bench }) => {
  await bench.compare(
    bench('shorthand string', () => {
      consume(parsePackageRepository('github:helpers4/typescript'));
    }),
    bench('object form with git+https URL', () => {
      consume(parsePackageRepository({ type: 'git', url: 'git+https://github.com/helpers4/typescript.git' }));
    }),
    RUN,
  );
});
