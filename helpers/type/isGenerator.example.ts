/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isGenerator } from './isGenerator';

const examples: HelperExamples = {
  helper: 'isGenerator',
  category: 'type',
  examples: [
    {
      title: 'Distinguish a generator instance from its function',
      description: 'isGenerator targets the object returned by calling a function*, not the function itself.',
      code: `function* counter() { yield 1; yield 2; }
isGenerator(counter())  // => true   (instance)
isGenerator(counter)    // => false  (function)
isGenerator([1, 2])     // => false`,
      assert: () => {
        function* counter() { yield 1; }
        if (!isGenerator(counter())) throw new Error('generator instance should return true');
        if (isGenerator(counter)) throw new Error('generator function should return false');
      },
    },
    {
      title: 'Type-narrow to safely call .next()',
      description: 'Narrows the type to Generator so you can call .next() and .return().',
      code: `function* gen() { yield 1; yield 2; }
const value: unknown = gen();
if (isGenerator(value)) {
  const { value: v, done } = value.next();
  // v: unknown, done: boolean | undefined
}`,
      assert: () => {
        function* gen() { yield 1; }
        const g: unknown = gen();
        if (!isGenerator(g)) throw new Error('should be generator');
        const { value } = g.next();
        if (value !== 1) throw new Error('first value should be 1');
      },
    },
  ],
};

export default examples;
