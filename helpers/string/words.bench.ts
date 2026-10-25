/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { words } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

const plain = 'hello world';
const camel = 'thisIsAVeryLongCamelCaseIdentifierNameForTesting';
const long = 'someCamelCase snake_case kebab-case SCREAMING_SNAKE foo123bar '.repeat(50);

test('words', async ({ bench }) => {
  await bench.compare(
    bench('plain whitespace-separated text', () => {
      consume(words(plain));
    }),
    bench('single long camelCase identifier', () => {
      consume(words(camel));
    }),
    bench('long mixed-case text', () => {
      consume(words(long));
    }),
    RUN,
  );
});
