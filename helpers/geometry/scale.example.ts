/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { applyToPoint } from './applyToPoint';
import { scale } from './scale';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'scale',
  category: 'geometry',
  examples: [
    {
      title: 'Uniform scale',
      description: 'One factor scales both axes.',
      code: `applyToPoint(scale(2), { x: 3, y: 4 }) // => { x: 6, y: 8 }`,
      assert: () => {
        const p = applyToPoint(scale(2), { x: 3, y: 4 });
        if (p.x !== 6 || p.y !== 8) throw new Error('Expected { x: 6, y: 8 }');
      },
    },
    {
      title: 'Flip vertically',
      description: 'A negative factor mirrors the axis.',
      code: `applyToPoint(scale(1, -1), { x: 3, y: 4 }) // => { x: 3, y: -4 }`,
      assert: () => {
        const p = applyToPoint(scale(1, -1), { x: 3, y: 4 });
        if (p.x !== 3 || p.y !== -4) throw new Error('Expected { x: 3, y: -4 }');
      },
    },
  ],
};

export default examples;
