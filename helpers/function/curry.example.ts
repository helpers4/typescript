/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { curry } from './curry';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'curry',
  category: 'function',
  examples: [
    {
      title: 'Create reusable adder',
      description: 'Curry a 2-argument function to build specialised versions.',
      code: `const add = curry((a: number, b: number) => a + b);
const add5 = add(5);

add5(3);  // => 8
add5(10); // => 15`,
      assert: () => {
        const add = curry((a: number, b: number) => a + b);
        const add5 = add(5);
        if (add5(3) !== 8) throw new Error('Expected 8');
        if (add5(10) !== 15) throw new Error('Expected 15');
      },
    },
    {
      title: 'Pipeline-friendly 3-argument function',
      description: 'Curry enables point-free style when composing pipelines.',
      code: `const clamp = curry((min: number, max: number, v: number) =>
  Math.min(Math.max(v, min), max)
);
const clamp0to100 = clamp(0)(100);

clamp0to100(42);  // => 42
clamp0to100(-5);  // => 0
clamp0to100(150); // => 100`,
      assert: () => {
        const clamp = curry((min: number, max: number, v: number) =>
          Math.min(Math.max(v, min), max)
        );
        const clamp0to100 = clamp(0)(100);
        if (clamp0to100(42) !== 42) throw new Error('Expected 42');
        if (clamp0to100(-5) !== 0) throw new Error('Expected 0');
        if (clamp0to100(150) !== 100) throw new Error('Expected 100');
      },
    },
  ],
};

export default examples;
