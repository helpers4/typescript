/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { trim } from './trim';

const short = '   Hello   ';
const long = '   ' + 'Hello, world! '.repeat(200) + '   ';

describe('trim', () => {
  bench('short string, default (whitespace) mode', () => {
    trim(short);
  });
  bench('long string, default (whitespace) mode', () => {
    trim(long);
  });
  bench('long string, wrappable mode', () => {
    trim(long, 'wrappable');
  });
});
