/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { trimEnd } from './trimEnd';

const short = 'Hello   ';
const long = 'Hello, world! '.repeat(200) + '   ';

describe('trimEnd', () => {
  bench('short string, default (whitespace) mode - native fast path', () => {
    trimEnd(short);
  });
  bench('short string, wrappable mode - regex path', () => {
    trimEnd(short, 'wrappable');
  });
  bench('long string, default (whitespace) mode - native fast path', () => {
    trimEnd(long);
  });
  bench('long string, wrappable mode - regex path', () => {
    trimEnd(long, 'wrappable');
  });
  bench('long string, unicode mode - regex path', () => {
    trimEnd(long, 'unicode');
  });
});
