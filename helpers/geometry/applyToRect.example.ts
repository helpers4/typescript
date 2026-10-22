/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { applyToRect } from './applyToRect';
import { rotate } from './rotate';
import { scale } from './scale';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'applyToRect',
  category: 'geometry',
  examples: [
    {
      title: 'Bounds of a scaled layer',
      description: 'The bounding box of the transformed rectangle.',
      code: `applyToRect(scale(2), { x: 1, y: 1, width: 2, height: 3 }) // => { x: 2, y: 2, width: 4, height: 6 }`,
      assert: () => {
        const r = applyToRect(scale(2), { x: 1, y: 1, width: 2, height: 3 });
        if (r.x !== 2 || r.width !== 4 || r.height !== 6) throw new Error('Unexpected bounds');
      },
    },
    {
      title: 'Bounds of a rotated layer',
      description: 'After a rotation, the box is larger than the rectangle.',
      code: `applyToRect(rotate(Math.PI / 4), { x: 0, y: 0, width: 1, height: 1 }).width // => √2`,
      assert: () => {
        const r = applyToRect(rotate(Math.PI / 4), { x: 0, y: 0, width: 1, height: 1 });
        if (Math.abs(r.width - Math.SQRT2) > 1e-12) throw new Error('Expected a width of √2');
      },
    },
  ],
};

export default examples;
