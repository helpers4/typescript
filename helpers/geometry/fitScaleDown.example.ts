/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { fitScaleDown } from './fitScaleDown';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'fitScaleDown',
  category: 'geometry',
  examples: [
    {
      title: 'Centered',
      description: "Same as fit(content, box, { mode: 'scale-down' }).",
      code: `fitScaleDown({ width: 200, height: 100 }, { width: 100, height: 100 })
// => { a: 0.5, b: 0, c: 0, d: 0.5, e: 0, f: 25 }`,
      assert: () => {
        const m = fitScaleDown({ width: 200, height: 100 }, { width: 100, height: 100 });
        if (m.a !== 0.5 || m.d !== 0.5 || m.e !== 0 || m.f !== 25) throw new Error('Unexpected fit');
      },
    },
    {
      title: 'Aligned to the top-left corner',
      description: 'The third argument is the alignment, like CSS object-position.',
      code: `fitScaleDown({ width: 200, height: 100 }, { width: 100, height: 100 }, { x: 0, y: 0 })`,
      assert: () => {
        const m = fitScaleDown({ width: 200, height: 100 }, { width: 100, height: 100 }, { x: 0, y: 0 });
        if (m.e !== 0 || m.f !== 0) throw new Error('Expected the top-left corner');
      },
    },
  ],
};

export default examples;
