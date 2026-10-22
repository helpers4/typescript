/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isAsyncIterable } from './isAsyncIterable';

const examples: HelperExamples = {
  helper: 'isAsyncIterable',
  category: 'type',
  examples: [
    {
      title: 'Detect an async generator',
      description: 'Async generators implement the async iterable protocol.',
      code: `async function* stream() { yield 1; yield 2; }
isAsyncIterable(stream())   // => true
isAsyncIterable([1, 2, 3])  // => false  (Iterable, not AsyncIterable)
isAsyncIterable('hello')    // => false`,
      assert: () => {
        async function* stream() { yield 1; }
        if (!isAsyncIterable(stream())) throw new Error('async generator should be async iterable');
        if (isAsyncIterable([1, 2])) throw new Error('array should not be async iterable');
      },
    },
    {
      title: 'Guard before for-await-of',
      description: 'Use to type-narrow before consuming a value with for-await-of.',
      code: `async function consume(source: unknown) {
  if (isAsyncIterable(source)) {
    for await (const item of source) {
      console.log(item);
    }
  }
}`,
      assert: () => {
        if (isAsyncIterable(null)) throw new Error('null should not be async iterable');
        if (isAsyncIterable(undefined)) throw new Error('undefined should not be async iterable');
      },
    },
  ],
};

export default examples;
