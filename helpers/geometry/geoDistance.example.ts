/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { geoDistance } from './geoDistance';

const examples: HelperExamples = {
  helper: 'geoDistance',
  category: 'geometry',
  examples: [
    {
      title: 'Distance between two cities',
      description: 'Great-circle distance in kilometres between two latitude/longitude points.',
      code: `geoDistance(48.8566, 2.3522, 51.5074, -0.1278)
// => about 343.6 (Paris to London)`,
      assert: () => {
        const km = geoDistance(48.8566, 2.3522, 51.5074, -0.1278);
        if (Math.abs(km - 343.6) > 1) throw new Error('Expected about 343.6 km');
      },
    },
    {
      title: 'Zero for the same point',
      description: 'A point is at distance 0 from itself.',
      code: `geoDistance(10, 20, 10, 20) // => 0`,
      assert: () => {
        if (geoDistance(10, 20, 10, 20) !== 0) throw new Error('Expected 0');
      },
    },
  ],
};

export default examples;
