/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { applyToPoint } from './applyToPoint';
import { invert } from './invert';
import { multiply } from './multiply';
import { scale } from './scale';
import { translate } from './translate';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'invert',
  category: 'geometry',
  examples: [
    {
      title: 'Pointer position in a layer',
      description: 'Invert the layer transform to map screen coordinates back into the layer.',
      code: `const layer = multiply(translate(100, 50), scale(2));
applyToPoint(invert(layer)!, { x: 120, y: 70 }) // => { x: 10, y: 10 }`,
      assert: () => {
        const layer = multiply(translate(100, 50), scale(2));
        const p = applyToPoint(invert(layer)!, { x: 120, y: 70 });
        if (p.x !== 10 || p.y !== 10) throw new Error('Expected { x: 10, y: 10 }');
      },
    },
    {
      title: 'Not invertible',
      description: 'A matrix that flattens the plane cannot be undone.',
      code: `invert(scale(0)) // => undefined`,
      assert: () => {
        if (invert(scale(0)) !== undefined) throw new Error('Expected undefined');
      },
    },
  ],
};

export default examples;
