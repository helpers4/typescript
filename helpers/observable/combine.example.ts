/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { combine } from './combine';
import { of } from 'rxjs';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'combine',
  category: 'observable',
  examples: [
    {
      title: 'Combine two observables with a map',
      description: 'Combines the latest values of two observables using a mapping function.',
      code: `combine(of(1), of(2), ([a, b]) => a + b)
// emits 3`,
      assert: async () => {
        let result: number | undefined;
        await new Promise<void>((resolve) => {
          combine(of(1), of(2), ([a, b]) => a + b).subscribe((v) => {
            result = v;
            resolve();
          });
        });
        if (result !== 3) throw new Error(`Expected 3, got ${result}`);
      },
    },
  ],
};

export default examples;
