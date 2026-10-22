/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { rectIntersection } from './rectIntersection';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'rectIntersection',
  category: 'geometry',
  examples: [
    {
      title: 'Visible part of a layer',
      description: 'Intersect a layer with the viewport.',
      code: `rectIntersection({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 10, height: 10 })
// => { x: 5, y: 5, width: 5, height: 5 }`,
      assert: () => {
        const r = rectIntersection({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 10, height: 10 })!;
        if (r.x !== 5 || r.width !== 5) throw new Error('Expected a 5 × 5 square at (5, 5)');
      },
    },
    {
      title: 'Touching rectangles',
      description: 'Sharing an edge is not overlapping.',
      code: `rectIntersection({ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 0, width: 10, height: 10 }) // => undefined`,
      assert: () => {
        if (rectIntersection({ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 0, width: 10, height: 10 }) !== undefined) throw new Error('Expected undefined');
      },
    },
  ],
};

export default examples;
