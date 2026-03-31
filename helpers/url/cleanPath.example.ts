/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { cleanPath } from './cleanPath';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'cleanPath',
  category: 'url',
  examples: [
    {
      title: 'Remove duplicate slashes',
      description: 'Cleans an URL by removing duplicate slashes while preserving the protocol.',
      code: `cleanPath('/path//to///resource')
// => '/path/to/resource'`,
      assert: () => {
        if (cleanPath('/path//to///resource') !== '/path/to/resource') throw new Error('Unexpected result');
      },
    },
    {
      title: 'Preserve protocol',
      description: 'The double slash after the protocol (http://) is not modified.',
      code: `cleanPath('http://example.com//path')
// => 'http://example.com/path'`,
      assert: () => {
        if (cleanPath('http://example.com//path') !== 'http://example.com/path') throw new Error('Unexpected result');
      },
    },
    {
      title: 'Handle null and undefined',
      description: 'Returns null for null input and undefined for undefined input.',
      code: `cleanPath(null)      // => null
cleanPath(undefined) // => undefined`,
      assert: () => {
        if (cleanPath(null) !== null) throw new Error('Expected null');
        if (cleanPath(undefined) !== undefined) throw new Error('Expected undefined');
      },
    },
  ],
};

export default examples;
