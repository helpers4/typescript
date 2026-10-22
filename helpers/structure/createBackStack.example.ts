/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { createBackStack } from './createBackStack';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'createBackStack',
  category: 'structure',
  examples: [
    {
      title: 'Navigate and go back',
      description: 'push() moves to a new entry; back() returns the entry it left and restores the previous one.',
      code: `const screens = createBackStack('home');
screens.push('settings');
screens.back();  // => 'settings'
screens.current; // => 'home'`,
      assert: () => {
        const screens = createBackStack('home');
        screens.push('settings');
        if (screens.back() !== 'settings') throw new Error('Expected back() to return the entry it left');
        if (screens.current !== 'home') throw new Error('Expected home to be current again');
      },
    },
    {
      title: 'Bound the stack',
      description: 'limit caps how many past entries are kept; the oldest are dropped first.',
      code: `const stack = createBackStack('', { limit: 1 });
stack.push('a');
stack.push('ab');
stack.back(); // => 'ab'
stack.back(); // => undefined — '' was dropped`,
      assert: () => {
        const stack = createBackStack('', { limit: 1 });
        stack.push('a');
        stack.push('ab');
        stack.back();
        if (stack.back() !== undefined) throw new Error('Expected the oldest entry to be dropped');
      },
    },
  ],
};

export default examples;
