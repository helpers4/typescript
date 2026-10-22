/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { applyToPoint } from './applyToPoint';
import { translate } from './translate';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'translate',
  category: 'geometry',
  examples: [
    {
      title: 'Move a point',
      description: 'e and f hold the offset.',
      code: `applyToPoint(translate(10, 5), { x: 1, y: 1 }) // => { x: 11, y: 6 }`,
      assert: () => {
        const p = applyToPoint(translate(10, 5), { x: 1, y: 1 });
        if (p.x !== 11 || p.y !== 6) throw new Error('Expected { x: 11, y: 6 }');
      },
    },
    {
      title: 'Negative offsets',
      description: 'Move up and to the left.',
      code: `applyToPoint(translate(-1, -1), { x: 0, y: 0 }) // => { x: -1, y: -1 }`,
      assert: () => {
        const p = applyToPoint(translate(-1, -1), { x: 0, y: 0 });
        if (p.x !== -1 || p.y !== -1) throw new Error('Expected { x: -1, y: -1 }');
      },
    },
  ],
};

export default examples;
