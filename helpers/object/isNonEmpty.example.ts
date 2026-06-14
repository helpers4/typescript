/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isNonEmpty } from './isNonEmpty';

const examples: HelperExamples = {
  helper: 'isNonEmpty',
  category: 'object',
  examples: [
    {
      title: 'Check if an object has own string-keyed properties',
      description: 'Returns true when at least one own enumerable string key is present.',
      code: `isNonEmpty({ a: 1 })        // => true
isNonEmpty({ a: undefined }) // => true  (key exists)
isNonEmpty({})              // => false`,
      assert: () => {
        if (!isNonEmpty({ a: 1 })) throw new Error('{a:1} should be non-empty');
        if (!isNonEmpty({ a: undefined })) throw new Error('{a:undefined} should be non-empty');
        if (isNonEmpty({})) throw new Error('{} should not be non-empty');
      },
    },
    {
      title: 'Guard before iterating object keys',
      description: 'Use isNonEmpty before looping to avoid processing empty objects.',
      code: `function processConfig(config: Record<string, unknown>): void {
  if (!isNonEmpty(config)) {
    console.warn('Config is empty');
    return;
  }
  for (const key of Object.keys(config)) {
    // process each key
  }
}`,
      assert: () => {
        if (isNonEmpty({})) throw new Error('Empty object should fail guard');
        if (!isNonEmpty({ x: 1 })) throw new Error('Non-empty object should pass guard');
      },
    },
  ],
};

export default examples;
