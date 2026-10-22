/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { intersects } from './intersects';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'intersects',
  category: 'geometry',
  examples: [
    {
      title: 'Is a layer on screen?',
      description: 'True when the rectangles have an area in common.',
      code: `intersects(layer, viewport)`,
      assert: () => {
        if (!intersects({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 10, height: 10 })) throw new Error('Expected an overlap');
      },
    },
    {
      title: 'Touching is not overlapping',
      description: 'Adjacent rectangles do not intersect.',
      code: `intersects({ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 0, width: 10, height: 10 }) // => false`,
      assert: () => {
        if (intersects({ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 0, width: 10, height: 10 })) throw new Error('Expected no overlap');
      },
    },
  ],
};

export default examples;
