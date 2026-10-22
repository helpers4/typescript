/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { applyToPoint } from './applyToPoint';
import { identity } from './identity';
import { multiply } from './multiply';
import { translate } from './translate';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'identity',
  category: 'geometry',
  examples: [
    {
      title: 'Start from no transformation',
      description: 'The identity leaves every point where it is.',
      code: `applyToPoint(identity(), { x: 3, y: 4 }) // => { x: 3, y: 4 }`,
      assert: () => {
        const p = applyToPoint(identity(), { x: 3, y: 4 });
        if (p.x !== 3 || p.y !== 4) throw new Error('Expected the point unchanged');
      },
    },
    {
      title: 'Neutral element of multiply',
      description: 'Multiplying by the identity returns the same transformation.',
      code: `multiply(identity(), translate(5, 0)) // => translate(5, 0)`,
      assert: () => {
        const m = multiply(identity(), translate(5, 0));
        if (m.e !== 5 || m.a !== 1) throw new Error('Expected translate(5, 0)');
      },
    },
  ],
};

export default examples;
