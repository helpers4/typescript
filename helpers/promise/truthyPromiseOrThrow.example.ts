/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { truthyPromiseOrThrow } from './truthyPromiseOrThrow';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'truthyPromiseOrThrow',
  category: 'promise',
  examples: [
    {
      title: 'Pass through truthy values',
      description: 'Returns the value if truthy, throws otherwise.',
      code: `Promise.resolve('data').then(truthyPromiseOrThrow('No data'))
// => 'data'`,
      assert: () => {
        const fn = truthyPromiseOrThrow('No data');
        if (fn('data') !== 'data') throw new Error('Expected pass-through');
      },
    },
    {
      title: 'Throw on falsy values',
      description: 'Throws an error when the value is falsy.',
      code: `Promise.resolve('').then(truthyPromiseOrThrow('Empty!'))
// throws Error('Empty!')`,
      assert: () => {
        const fn = truthyPromiseOrThrow('Empty!');
        try {
          fn('');
          throw new Error('Should have thrown');
        } catch (e) {
          if ((e as Error).message !== 'Empty!') throw new Error('Wrong error');
        }
      },
    },
  ],
};

export default examples;
