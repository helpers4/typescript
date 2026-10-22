/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { consoleLogPromise } from './consoleLogPromise';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'consoleLogPromise',
  category: 'promise',
  examples: [
    {
      title: 'Log and pass-through in a promise chain',
      description: 'Creates a function that logs data with an optional prefix and returns it unchanged.',
      code: `Promise.resolve(42).then(consoleLogPromise('value:'))
// logs "value: 42" and resolves with 42`,
      assert: () => {
        const fn = consoleLogPromise('test:');
        const result = fn(42);
        if (result !== 42) throw new Error(`Expected 42, got ${result}`);
      },
    },
  ],
};

export default examples;
