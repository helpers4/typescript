/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { extractErrorMessage } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

const errorInstance = new Error('Something went wrong');
const plainObject = { message: 'A plain object error' };
const unknownValue = { foo: 'bar' };

test('extractErrorMessage', async ({ bench }) => {
  await bench.compare(
    bench('Error instance', () => {
      consume(extractErrorMessage(errorInstance));
    }),
    bench('plain object with message property', () => {
      consume(extractErrorMessage(plainObject));
    }),
    bench('unrecognized value, stringify: true', () => {
      consume(extractErrorMessage(unknownValue, true));
    }),
    RUN,
  );
});
