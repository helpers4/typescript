/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { applyToPoint } from './applyToPoint';
import { rotate } from './rotate';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'rotate',
  category: 'geometry',
  examples: [
    {
      title: 'Quarter turn',
      description: 'With y pointing down, a positive angle turns clockwise, like CSS rotate().',
      code: `applyToPoint(rotate(Math.PI / 2), { x: 1, y: 0 }) // => { x: 0, y: 1 } (rounded)`,
      assert: () => {
        const p = applyToPoint(rotate(Math.PI / 2), { x: 1, y: 0 });
        if (Math.abs(p.x) > 1e-12 || Math.abs(p.y - 1) > 1e-12) throw new Error('Expected { x: 0, y: 1 }');
      },
    },
    {
      title: 'Degrees',
      description: 'Convert degrees to radians first.',
      code: `rotate((45 * Math.PI) / 180)`,
      assert: () => {
        const m = rotate((45 * Math.PI) / 180);
        if (Math.abs(m.a - Math.SQRT1_2) > 1e-12) throw new Error('Expected cos(45°)');
      },
    },
  ],
};

export default examples;
