/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { tryit } from './tryit';
import type { HelperExamples } from '../../scripts/examples/types';
import type { Result } from './tryit';

const examples: HelperExamples = {
  helper: 'tryit',
  category: 'promise',
  examples: [
    {
      title: 'Safe JSON parsing',
      description: 'Wraps JSON.parse to return a tuple instead of throwing.',
      code: `const safeParse = tryit(JSON.parse);
const [error, data] = safeParse('{"a":1}');
// error === undefined, data === { a: 1 }`,
      assert: () => {
        const safeParse = tryit(JSON.parse);
        const [error, data] = safeParse('{"a":1}') as Result<unknown>;
        if (error !== undefined) throw new Error('Should not have error');
        if ((data as Record<string, number>).a !== 1) throw new Error(`Expected { a: 1 }, got ${JSON.stringify(data)}`);
      },
    },
    {
      title: 'Catching errors without try/catch',
      description: 'On error, the first element of the tuple is the Error.',
      code: `const safeParse = tryit(JSON.parse);
const [error, data] = safeParse('invalid');
// error instanceof SyntaxError, data === undefined`,
      assert: () => {
        const safeParse = tryit(JSON.parse);
        const [error, data] = safeParse('invalid json') as Result<unknown>;
        if (!(error instanceof Error)) throw new Error('Expected an Error');
        if (data !== undefined) throw new Error('Expected undefined data');
      },
    },
  ],
};

export default examples;
