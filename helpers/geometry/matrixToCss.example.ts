/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { matrixToCss } from './matrixToCss';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'matrixToCss',
  category: 'geometry',
  examples: [
    {
      title: 'Write a CSS transform',
      description: 'The six entries in CSS and SVG order.',
      code: `matrixToCss({ a: 2, b: 0, c: 0, d: 2, e: 10, f: -5 }) // => 'matrix(2, 0, 0, 2, 10, -5)'`,
      assert: () => {
        if (matrixToCss({ a: 2, b: 0, c: 0, d: 2, e: 10, f: -5 }) !== 'matrix(2, 0, 0, 2, 10, -5)') throw new Error('Unexpected CSS');
      },
    },
    {
      title: 'Fit a frame into a viewport',
      description: 'Combine with fitContain to scale an element with CSS.',
      code: `element.style.transform = matrixToCss(fitContain(frame, viewport));`,
      assert: () => {
        if (matrixToCss({ a: 0.5, b: 0, c: 0, d: 0.5, e: 0, f: 25 }) !== 'matrix(0.5, 0, 0, 0.5, 0, 25)') throw new Error('Unexpected CSS');
      },
    },
  ],
};

export default examples;
