/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isWithinDistance } from './isWithinDistance';

const examples: HelperExamples = {
  helper: 'isWithinDistance',
  category: 'geography',
  examples: [
    {
      title: 'Is a place near me?',
      description: 'Radius check in kilometres, border included.',
      code: `isWithinDistance(48.8566, 2.3522, 5, 48.8606, 2.3376)
// => true`,
      assert: () => {
        if (!isWithinDistance(48.8566, 2.3522, 5, 48.8606, 2.3376)) throw new Error('Expected the point to be within 5 km');
      },
    },
    {
      title: 'Far away',
      description: 'Paris is not within 5 km of London.',
      code: `isWithinDistance(48.8566, 2.3522, 5, 51.5074, -0.1278)
// => false`,
      assert: () => {
        if (isWithinDistance(48.8566, 2.3522, 5, 51.5074, -0.1278)) throw new Error('Expected the point to be outside 5 km');
      },
    },
  ],
};

export default examples;
