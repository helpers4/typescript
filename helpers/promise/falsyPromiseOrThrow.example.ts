/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { falsyPromiseOrThrow } from './falsyPromiseOrThrow';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'falsyPromiseOrThrow',
  category: 'promise',
  examples: [
    {
      title: 'Pass through falsy values',
      description: 'Returns the value if falsy, throws otherwise.',
      code: `Promise.resolve(null).then(falsyPromiseOrThrow('Expected falsy'))
// => null`,
      assert: () => {
        const fn = falsyPromiseOrThrow('Expected falsy');
        const result = fn(null);
        if (result !== null) throw new Error('Expected null');
      },
    },
    {
      title: 'Throw on truthy values',
      description: 'Throws an error when the value is truthy.',
      code: `Promise.resolve('oops').then(falsyPromiseOrThrow('Should be empty'))
// throws Error('Should be empty')`,
      assert: () => {
        const fn = falsyPromiseOrThrow('Should be empty');
        try {
          fn('oops');
          throw new Error('Should have thrown');
        } catch (e) {
          if ((e as Error).message !== 'Should be empty') throw new Error('Wrong error');
        }
      },
    },
  ],
};

export default examples;
