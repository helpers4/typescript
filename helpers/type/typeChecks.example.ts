/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { isString, isNumber, isBoolean, isArray, isObject, isDate, isSet, isFunction, isValidRegex } from './typeChecks';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isString',
  category: 'type',
  examples: [
    {
      title: 'Type guard functions',
      description: 'A collection of type guard functions for common types.',
      code: `isString('hello')  // => true
isNumber(42)       // => true
isBoolean(false)   // => true
isArray([1, 2])    // => true
isObject({ a: 1 }) // => true
isDate(new Date()) // => true`,
      assert: () => {
        if (!isString('hello')) throw new Error('isString failed');
        if (!isNumber(42)) throw new Error('isNumber failed');
        if (!isBoolean(false)) throw new Error('isBoolean failed');
        if (!isArray([1, 2])) throw new Error('isArray failed');
        if (!isObject({ a: 1 })) throw new Error('isObject failed');
        if (!isDate(new Date())) throw new Error('isDate failed');
      },
    },
    {
      title: 'isSet checks for non-null/undefined',
      description: 'Returns true when the value is neither null nor undefined.',
      code: `isSet(0)         // => true
isSet('')        // => true
isSet(null)      // => false
isSet(undefined) // => false`,
      assert: () => {
        if (!isSet(0)) throw new Error('isSet(0) should be true');
        if (!isSet('')) throw new Error("isSet('') should be true");
        if (isSet(null)) throw new Error('isSet(null) should be false');
        if (isSet(undefined)) throw new Error('isSet(undefined) should be false');
      },
    },
    {
      title: 'Validate regex patterns',
      description: 'Checks whether a string is a valid regular expression.',
      code: `isValidRegex('[a-z]+')  // => true
isValidRegex('[invalid') // => false`,
      assert: () => {
        if (!isValidRegex('[a-z]+')) throw new Error('Expected valid regex');
        if (isValidRegex('[invalid')) throw new Error('Expected invalid regex');
      },
    },
    {
      title: 'isFunction type guard',
      description: 'Returns true for functions.',
      code: `isFunction(() => {})      // => true
isFunction('not a fn')    // => false`,
      assert: () => {
        if (!isFunction(() => {})) throw new Error('Expected true for arrow fn');
        if (isFunction('not a fn')) throw new Error('Expected false for string');
      },
    },
  ],
};

export default examples;
