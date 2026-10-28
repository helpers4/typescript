/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { roundedRectPath } from './roundedRectPath';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'roundedRectPath',
  category: 'geometry',
  examples: [
    {
      title: 'Round one corner',
      description: 'A radius per corner, in CSS order; zero keeps a square corner.',
      code: `roundedRectPath({ x: 0, y: 0, width: 10, height: 10 }, [5, 0, 0, 0])`,
      assert: () => {
        if (!roundedRectPath({ x: 0, y: 0, width: 10, height: 10 }, [5, 0, 0, 0]).includes('A5 5')) throw new Error('Expected one arc');
      },
    },
  ],
};

export default examples;
