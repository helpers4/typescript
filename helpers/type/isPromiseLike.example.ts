/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isPromiseLike } from './isPromiseLike';

const examples: HelperExamples = {
  helper: 'isPromiseLike',
  category: 'type',
  examples: [
    {
      title: 'Detect any thenable',
      description: 'Returns true for native Promises and any object with a .then() method.',
      code: `isPromiseLike(Promise.resolve(1))    // => true
isPromiseLike({ then: () => {} })    // => true   (thenable)
isPromiseLike(42)                    // => false
isPromiseLike(null)                  // => false
isPromiseLike({ then: 'not-a-fn' }) // => false`,
      assert: () => {
        if (!isPromiseLike(Promise.resolve(1))) throw new Error('Promise should be PromiseLike');
        // eslint-disable-next-line unicorn/no-thenable -- Testing thenable detection
        if (!isPromiseLike({ then: () => {} })) throw new Error('thenable should be PromiseLike');
        if (isPromiseLike(42)) throw new Error('number should not be PromiseLike');
        // eslint-disable-next-line unicorn/no-thenable -- Testing thenable detection
        if (isPromiseLike({ then: 'not-a-fn' })) throw new Error('non-fn then should return false');
      },
    },
    {
      title: 'Handle both Promises and thenables in a utility',
      description: 'Use isPromiseLike to accept any thenable, not just native Promises.',
      code: `function toPromise<T>(value: T | PromiseLike<T>): Promise<T> {
  if (isPromiseLike(value)) return Promise.resolve(value);
  return Promise.resolve(value);
}`,
      assert: () => {
        if (!isPromiseLike(new Promise(() => {}))) throw new Error('Promise should pass');
      },
    },
  ],
};

export default examples;
