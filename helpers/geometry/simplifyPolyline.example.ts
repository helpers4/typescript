/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { simplifyPolyline } from './simplifyPolyline';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'simplifyPolyline',
  category: 'geometry',
  examples: [
    {
      title: 'Drop a nearly straight point',
      description: 'A point closer than the tolerance to the simplified line is removed.',
      code: `simplifyPolyline([{ x: 0, y: 0 }, { x: 1, y: 0.1 }, { x: 2, y: 0 }], 0.5)
// => [{ x: 0, y: 0 }, { x: 2, y: 0 }]`,
      assert: () => {
        if (simplifyPolyline([{ x: 0, y: 0 }, { x: 1, y: 0.1 }, { x: 2, y: 0 }], 0.5).length !== 2) throw new Error('Expected 2 points');
      },
    },
    {
      title: 'Shrink a map outline',
      description: 'Pick the tolerance in the units of the points, e.g. a fraction of a pixel at the final scale.',
      code: `const outline = simplifyPolyline(border, 0.5);`,
      assert: () => {
        const zigzag = Array.from({ length: 100 }, (_, i) => ({ x: i, y: i % 2 ? 0.2 : 0 }));
        if (simplifyPolyline(zigzag, 0.5).length !== 2) throw new Error('Expected only the ends');
      },
    },
  ],
};

export default examples;
