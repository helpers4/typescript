/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { containsPoint } from './containsPoint';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'containsPoint',
  category: 'geometry',
  examples: [
    {
      title: 'Hit-test a click',
      description: 'Find the hotspot under the pointer.',
      code: `const hit = hotspots.find((zone) => containsPoint(zone, { x: event.offsetX, y: event.offsetY }));`,
      assert: () => {
        if (!containsPoint({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5 })) throw new Error('Expected a hit');
      },
    },
    {
      title: 'Shared edges hit once',
      description: 'The right and bottom edges are outside, so a point between two adjacent zones hits only one.',
      code: `containsPoint({ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 5 })  // => false
containsPoint({ x: 10, y: 0, width: 10, height: 10 }, { x: 10, y: 5 }) // => true`,
      assert: () => {
        if (containsPoint({ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 5 })) throw new Error('Expected a miss');
        if (!containsPoint({ x: 10, y: 0, width: 10, height: 10 }, { x: 10, y: 5 })) throw new Error('Expected a hit');
      },
    },
  ],
};

export default examples;
