/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { interpolate } from './interpolate';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'interpolate',
  category: 'animation',
  examples: [
    {
      title: 'Blend a set of properties',
      description: 'Every number in the structure moves from its start to its end value.',
      code: `interpolate({ x: 0, y: 100 }, { x: 50, y: 0 }, 0.5) // => { x: 25, y: 50 }`,
      assert: () => {
        const value = interpolate({ x: 0, y: 100 }, { x: 50, y: 0 }, 0.5);
        if (value.x !== 25 || value.y !== 50) throw new Error('Expected { x: 25, y: 50 }');
      },
    },
    {
      title: 'With an easing',
      description: 'Pass the eased progress as t; overshooting easings carry the value past the end.',
      code: `interpolate(0, 100, parseEasing('ease-out')!(0.5)) // => 68.46...`,
      assert: () => {
        if (interpolate(0, 100, 1.2) !== 120) throw new Error('Expected no clamping');
      },
    },
  ],
};

export default examples;
