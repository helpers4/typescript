/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isGeneratorFunction } from './isGeneratorFunction';

const examples: HelperExamples = {
  helper: 'isGeneratorFunction',
  category: 'type',
  examples: [
    {
      title: 'Detect a generator function',
      description: 'Returns true for function* declarations and expressions.',
      code: `function* gen() { yield 1; }
isGeneratorFunction(gen)      // => true
isGeneratorFunction(gen())    // => false  (instance, not function)
isGeneratorFunction(() => {}) // => false`,
      assert: () => {
        function* gen() { yield 1; }
        if (!isGeneratorFunction(gen)) throw new Error('should be generator function');
        if (isGeneratorFunction(gen())) throw new Error('instance should not be generator function');
        if (isGeneratorFunction(() => {})) throw new Error('arrow fn should not be generator function');
      },
    },
    {
      title: 'Filter generator factories from a mixed array',
      description: 'Use as a predicate to select only generator functions.',
      code: `const fns = [() => {}, function* () { yield 1; }, async () => {}];
fns.filter(isGeneratorFunction)
// => [function* () { yield 1; }]`,
      assert: () => {
        const fns = [() => {}, function* () { yield 1; }, async () => {}];
        const result = fns.filter(isGeneratorFunction);
        if (result.length !== 1) throw new Error('Expected exactly one generator function');
      },
    },
  ],
};

export default examples;
