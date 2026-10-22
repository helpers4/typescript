/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isPropertyKey } from './isPropertyKey';

const examples: HelperExamples = {
  helper: 'isPropertyKey',
  category: 'type',
  examples: [
    {
      title: 'Detect valid property keys',
      description: 'Strings, numbers, and symbols are valid property keys.',
      code: `isPropertyKey('name')        // => true
isPropertyKey(42)            // => true
isPropertyKey(Symbol('id'))  // => true
isPropertyKey(null)          // => false
isPropertyKey(true)          // => false`,
      assert: () => {
        if (!isPropertyKey('name')) throw new Error("'name' should be a property key");
        if (!isPropertyKey(42)) throw new Error('42 should be a property key');
        if (!isPropertyKey(Symbol('id'))) throw new Error('Symbol should be a property key');
        if (isPropertyKey(null)) throw new Error('null should not be a property key');
        if (isPropertyKey(true)) throw new Error('boolean should not be a property key');
      },
    },
    {
      title: 'Safe dynamic property access',
      description: 'Use as a guard before indexing an object with an unknown key.',
      code: `function get(obj: Record<PropertyKey, unknown>, key: unknown): unknown {
  if (isPropertyKey(key)) return obj[key];
  return undefined;
}
get({ a: 1 }, 'a')    // => 1
get({ a: 1 }, null)   // => undefined`,
      assert: () => {
        function get(obj: Record<PropertyKey, unknown>, key: unknown): unknown {
          if (isPropertyKey(key)) return obj[key];
          return undefined;
        }
        if (get({ a: 1 }, 'a') !== 1) throw new Error('Expected 1');
        if (get({ a: 1 }, null) !== undefined) throw new Error('Expected undefined');
      },
    },
  ],
};

export default examples;
