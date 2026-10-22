/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { meaningPromiseOrThrow } from './meaningPromiseOrThrow';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'meaningPromiseOrThrow',
  category: 'promise',
  examples: [
    {
      title: 'Pass through meaningful values',
      description: 'Returns the value if it is not empty (null, undefined, empty string, empty object, empty array).',
      code: `Promise.resolve({ key: 'value' }).then(meaningPromiseOrThrow('No data'))
// => { key: 'value' }`,
      assert: () => {
        const fn = meaningPromiseOrThrow('No data');
        const result = fn({ key: 'value' });
        if ((result as Record<string, string>).key !== 'value') throw new Error('Expected pass-through');
      },
    },
    {
      title: 'Throw on empty values',
      description: 'Throws when the value is null, undefined, empty string, empty object, or empty array.',
      code: `Promise.resolve({}).then(meaningPromiseOrThrow('Empty!'))
// throws Error('Empty!')`,
      assert: () => {
        const fn = meaningPromiseOrThrow('Empty!');
        try {
          fn({});
          throw new Error('Should have thrown');
        } catch (e) {
          if ((e as Error).message !== 'Empty!') throw new Error('Wrong error');
        }
      },
    },
  ],
};

export default examples;
