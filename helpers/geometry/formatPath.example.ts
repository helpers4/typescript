/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { formatPath } from './formatPath';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'formatPath',
  category: 'geometry',
  examples: [
    {
      title: 'Write commands back',
      description: 'Numbers are rounded and written with single spaces.',
      code: `formatPath([{ type: 'M', values: [0, 0.5] }, { type: 'L', values: [10, 1 / 3] }]) // => 'M0 0.5 L10 0.333333'`,
      assert: () => {
        if (formatPath([{ type: 'M', values: [0, 0.5] }, { type: 'L', values: [10, 1 / 3] }]) !== 'M0 0.5 L10 0.333333') throw new Error('Unexpected path');
      },
    },
  ],
};

export default examples;
