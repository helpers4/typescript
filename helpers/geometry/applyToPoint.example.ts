/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { applyToPoint } from './applyToPoint';
import { translate } from './translate';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'applyToPoint',
  category: 'geometry',
  examples: [
    {
      title: 'Transform a point',
      description: "x' = a·x + c·y + e, y' = b·x + d·y + f.",
      code: `applyToPoint({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 }, { x: 1, y: 1 }) // => { x: 9, y: 12 }`,
      assert: () => {
        const p = applyToPoint({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 }, { x: 1, y: 1 });
        if (p.x !== 9 || p.y !== 12) throw new Error('Expected { x: 9, y: 12 }');
      },
    },
    {
      title: 'With a helper matrix',
      description: 'Any matrix built by translate, scale, rotate or multiply.',
      code: `applyToPoint(translate(10, 5), { x: 1, y: 1 }) // => { x: 11, y: 6 }`,
      assert: () => {
        const p = applyToPoint(translate(10, 5), { x: 1, y: 1 });
        if (p.x !== 11 || p.y !== 6) throw new Error('Expected { x: 11, y: 6 }');
      },
    },
  ],
};

export default examples;
