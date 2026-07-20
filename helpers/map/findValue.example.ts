/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { findValue } from './findValue';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'findValue',
  category: 'map',
  examples: [
    {
      title: 'Find the first matching value',
      description: 'Searches in insertion order and returns the value of the first match.',
      code: `findValue(new Map([['a', 1], ['b', 2]]), value => value > 1)
// => 2`,
      assert: () => {
        if (findValue(new Map([['a', 1], ['b', 2]]), (v) => v > 1) !== 2) throw new Error('Expected 2');
      },
    },
    {
      title: 'No match',
      description: 'Returns undefined when nothing satisfies the predicate.',
      code: `findValue(new Map([['a', 1]]), value => value > 10)
// => undefined`,
      assert: () => {
        if (findValue(new Map([['a', 1]]), (v) => v > 10) !== undefined) throw new Error('Expected undefined');
      },
    },
  ],
};

export default examples;
