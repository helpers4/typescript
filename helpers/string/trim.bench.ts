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
  bench('short string, default (whitespace) mode - native fast path', () => {
    trim(short);
  });
  bench('short string, wrappable mode - regex path', () => {
    trim(short, 'wrappable');
  });
  bench('long string, default (whitespace) mode - native fast path', () => {
    trim(long);
  });
  bench('long string, wrappable mode - regex path', () => {
    trim(long, 'wrappable');
  });
  bench('long string, unicode mode - regex path', () => {
    trim(long, 'unicode');
  });
});
