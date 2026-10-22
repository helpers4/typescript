/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { rectUnion } from './rectUnion';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'rectUnion',
  category: 'geometry',
  examples: [
    {
      title: 'Bounds of a group',
      description: 'The smallest rectangle containing every layer.',
      code: `rectUnion([{ x: 0, y: 0, width: 10, height: 10 }, { x: 20, y: 5, width: 10, height: 10 }])
// => { x: 0, y: 0, width: 30, height: 15 }`,
      assert: () => {
        const r = rectUnion([{ x: 0, y: 0, width: 10, height: 10 }, { x: 20, y: 5, width: 10, height: 10 }])!;
        if (r.width !== 30 || r.height !== 15) throw new Error('Expected 30 × 15');
      },
    },
    {
      title: 'Empty group',
      description: 'No rectangle, no bounds.',
      code: `rectUnion([]) // => undefined`,
      assert: () => {
        if (rectUnion([]) !== undefined) throw new Error('Expected undefined');
      },
    },
  ],
};

export default examples;
