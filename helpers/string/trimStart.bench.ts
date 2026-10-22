/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { trimStart } from './trimStart';

const short = '   Hello';
const long = '   ' + 'Hello, world! '.repeat(200);

describe('trimStart', () => {
  bench('short string, default (whitespace) mode - native fast path', () => {
    trimStart(short);
  });
  bench('short string, wrappable mode - regex path', () => {
    trimStart(short, 'wrappable');
  });
  bench('long string, default (whitespace) mode - native fast path', () => {
    trimStart(long);
  });
  bench('long string, wrappable mode - regex path', () => {
    trimStart(long, 'wrappable');
  });
});
