/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { formatPartialDate } from './formatPartialDate';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'formatPartialDate',
  category: 'date',
  examples: [
    {
      title: 'Label at the known precision',
      description: 'An approximate year reads "c. 2008", a month "Mar 2008", a day "Mar 9, 2008".',
      code: `formatPartialDate('2008')       // => 'c. 2008'
formatPartialDate('2008-03')    // => 'Mar 2008'
formatPartialDate('2008-03-09') // => 'Mar 9, 2008'`,
      assert: () => {
        if (formatPartialDate('2008') !== 'c. 2008') throw new Error('year');
        if (formatPartialDate('2008-03') !== 'Mar 2008') throw new Error('month');
        if (formatPartialDate('2008-03-09') !== 'Mar 9, 2008') throw new Error('day');
      },
    },
    {
      title: 'Invalid input',
      description: 'Returns null instead of a wrong label.',
      code: `formatPartialDate('2008-13') // => null`,
      assert: () => {
        if (formatPartialDate('2008-13') !== null) throw new Error('Expected null');
      },
    },
  ],
};

export default examples;
