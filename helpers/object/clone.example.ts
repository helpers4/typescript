/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { clone } from './clone';

const examples: HelperExamples = {
  helper: 'clone',
  category: 'object',
  examples: [
    {
      title: 'Shallow-copy a plain object',
      description: 'Top-level keys are copied; nested values still share references (shallow).',
      code: `const obj = { a: 1, b: { c: 2 } };
const copy = clone(obj);
copy.b === obj.b // => true (same nested reference)`,
      assert: () => {
        const obj = { a: 1, b: { c: 2 } };
        const copy = clone(obj);
        if (copy === obj) throw new Error('Expected a new top-level object');
        if (copy.b !== obj.b) throw new Error('Expected the nested reference to be shared');
      },
    },
    {
      title: 'Correctly clones Date/Map/Set, unlike a spread',
      description: "{ ...new Date() } produces {} — clone() doesn't have that problem.",
      code: `clone(new Map([['a', 1]]))
// => new Map with the same entries, not {}`,
      assert: () => {
        const map = new Map([['a', 1]]);
        const result = clone(map);
        if (result === map || result.get('a') !== 1) throw new Error('Expected an equivalent, independent Map');
      },
    },
  ],
};

export default examples;
