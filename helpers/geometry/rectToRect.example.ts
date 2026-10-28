/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { rectToRect } from './rectToRect';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'rectToRect',
  category: 'geometry',
  examples: [
    {
      title: 'Put one box on another',
      description: 'The matrix scales and moves the first rectangle exactly onto the second.',
      code: `rectToRect({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 20, height: 10 })
// => { a: 2, b: 0, c: 0, d: 1, e: 5, f: 5 }`,
      assert: () => {
        const m = rectToRect({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 20, height: 10 });
        if (m.a !== 2 || m.d !== 1 || m.e !== 5 || m.f !== 5) throw new Error('Unexpected matrix');
      },
    },
  ],
};

export default examples;
