/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { contains } from './contains';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'contains',
  category: 'geometry',
  examples: [
    {
      title: 'Hit-test a click',
      description: 'Shared edges hit once: the right and bottom edges are outside.',
      code: `const hit = hotspots.find((zone) => contains(zone, { x: event.offsetX, y: event.offsetY }));`,
      assert: () => {
        if (!contains({ x: 0, y: 0, width: 10, height: 10 }, { x: 0, y: 5 })) throw new Error('Expected a hit');
        if (contains({ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 5 })) throw new Error('Expected a miss');
      },
    },
    {
      title: 'Is a layer fully on screen?',
      description: 'A rectangle is inside when it does not stick out.',
      code: `contains(viewport, layerBounds)`,
      assert: () => {
        if (!contains({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 5, height: 5 })) throw new Error('Expected inside');
      },
    },
  ],
};

export default examples;
