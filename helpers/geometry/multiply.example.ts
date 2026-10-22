/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { applyToPoint } from './applyToPoint';
import { multiply } from './multiply';
import { scale } from './scale';
import { translate } from './translate';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'multiply',
  category: 'geometry',
  examples: [
    {
      title: 'Same order as a CSS transform list',
      description: 'The last matrix applies first: here, scale then translate.',
      code: `// transform: translate(10px, 0) scale(2)
applyToPoint(multiply(translate(10, 0), scale(2)), { x: 1, y: 1 }) // => { x: 12, y: 2 }`,
      assert: () => {
        const p = applyToPoint(multiply(translate(10, 0), scale(2)), { x: 1, y: 1 });
        if (p.x !== 12 || p.y !== 2) throw new Error('Expected { x: 12, y: 2 }');
      },
    },
    {
      title: 'Scale around a point',
      description: 'Move the point to the origin, scale, move it back.',
      code: `const m = multiply(translate(50, 50), scale(2), translate(-50, -50));
applyToPoint(m, { x: 60, y: 50 }) // => { x: 70, y: 50 }`,
      assert: () => {
        const m = multiply(translate(50, 50), scale(2), translate(-50, -50));
        const p = applyToPoint(m, { x: 60, y: 50 });
        if (p.x !== 70 || p.y !== 50) throw new Error('Expected { x: 70, y: 50 }');
      },
    },
  ],
};

export default examples;
