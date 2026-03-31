/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { returnOrThrowError } from './returnOrThrowError';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'returnOrThrowError',
  category: 'function',
  examples: [
    {
      title: 'Return a defined value',
      description: 'Returns the value when it is defined and not null.',
      code: `returnOrThrowError('hello', 'Value is missing')
// => 'hello'`,
      assert: () => {
        const result = returnOrThrowError('hello', 'Value is missing');
        if (result !== 'hello') throw new Error('Unexpected result');
      },
    },
    {
      title: 'Throw on null',
      description: 'Throws an error when the value is null or undefined.',
      code: `returnOrThrowError(null, 'Value is missing')
// throws Error('Value is missing')`,
      assert: () => {
        try {
          returnOrThrowError(null, 'Value is missing');
          throw new Error('Should have thrown');
        } catch (e) {
          if ((e as Error).message !== 'Value is missing') throw new Error('Wrong error message');
        }
      },
    },
  ],
};

export default examples;
