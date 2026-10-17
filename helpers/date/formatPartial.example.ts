/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { formatPartial } from './formatPartial';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'formatPartial',
  category: 'date',
  examples: [
    {
      title: 'Label at the known precision',
      description: 'An approximate year reads "c. 2008", a month "Mar 2008", a day "Mar 9, 2008".',
      code: `formatPartial('2008')       // => 'c. 2008'
formatPartial('2008-03')    // => 'Mar 2008'
formatPartial('2008-03-09') // => 'Mar 9, 2008'`,
      assert: () => {
        if (formatPartial('2008') !== 'c. 2008') throw new Error('year');
        if (formatPartial('2008-03') !== 'Mar 2008') throw new Error('month');
        if (formatPartial('2008-03-09') !== 'Mar 9, 2008') throw new Error('day');
      },
    },
    {
      title: 'Invalid input',
      description: 'Returns null instead of a wrong label.',
      code: `formatPartial('2008-13') // => null`,
      assert: () => {
        if (formatPartial('2008-13') !== null) throw new Error('Expected null');
      },
    },
  ],
};

export default examples;
