/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { map } from './map';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'map',
  category: 'object',
  examples: [
    {
      title: 'Transform values',
      code: `map({ a: 1, b: 2 }, v => v * 10)
// => { a: 10, b: 20 }`,
      assert: () => {
        const result = map({ a: 1, b: 2 }, v => v * 10);
        if (result['a'] !== 10 || result['b'] !== 20) throw new Error('Unexpected values');
      },
    },
    {
      title: 'Transform keys',
      code: `map({ a: 1, b: 2 }, undefined, k => k.toUpperCase())
// => { A: 1, B: 2 }`,
      assert: () => {
        const result = map({ a: 1, b: 2 }, undefined, k => (k as string).toUpperCase());
        if (result['A'] !== 1 || result['B'] !== 2) throw new Error('Unexpected keys');
      },
    },
    {
      title: 'Transform both keys and values in a single pass',
      code: `map(
  { price: 100, discount: 20 },
  v => v / 100,
  k => \`\${k}Ratio\`
)
// => { priceRatio: 1, discountRatio: 0.2 }`,
      assert: () => {
        const result = map(
          { price: 100, discount: 20 } as Record<string, number>,
          v => v / 100,
          k => `${k as string}Ratio`
        );
        if (result['priceRatio'] !== 1) throw new Error('Expected priceRatio: 1');
        if (result['discountRatio'] !== 0.2) throw new Error('Expected discountRatio: 0.2');
      },
    },
  ],
};

export default examples;
