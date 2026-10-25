/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { slugify } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

test('slugify', async ({ bench }) => {
  await bench.compare(
    bench('simple string', () => {
      consume(slugify('Hello World'));
    }),
    bench('string with accents', () => {
      consume(slugify('Héllo Wörld café résumé'));
    }),
    bench('string with special chars', () => {
      consume(slugify('Hello! @World# $How% ^Are& *You?'));
    }),
    bench('already slugified', () => {
      consume(slugify('hello-world'));
    }),
    bench('long string', () => {
      consume(slugify('This is a very long string that should be converted to a URL friendly slug format'));
    }),
    RUN,
  );
});
