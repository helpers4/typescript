/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { fitCover } from './fitCover';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'fitCover',
  category: 'geometry',
  examples: [
    {
      title: 'Centered',
      description: "Same as fit(content, box, { mode: 'cover' }).",
      code: `fitCover({ width: 200, height: 100 }, { width: 100, height: 100 })
// => { a: 1, b: 0, c: 0, d: 1, e: -50, f: 0 }`,
      assert: () => {
        const m = fitCover({ width: 200, height: 100 }, { width: 100, height: 100 });
        if (m.a !== 1 || m.d !== 1 || m.e !== -50 || m.f !== 0) throw new Error('Unexpected fit');
      },
    },
    {
      title: 'Aligned to the top-left corner',
      description: 'The third argument is the alignment, like CSS object-position.',
      code: `fitCover({ width: 200, height: 100 }, { width: 100, height: 100 }, { x: 0, y: 0 })`,
      assert: () => {
        const m = fitCover({ width: 200, height: 100 }, { width: 100, height: 100 }, { x: 0, y: 0 });
        if (m.e !== 0 || m.f !== 0) throw new Error('Expected the top-left corner');
      },
    },
  ],
};

export default examples;
