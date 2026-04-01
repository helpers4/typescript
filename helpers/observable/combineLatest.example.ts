/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { combineLatest } from './combineLatest';
import { of } from 'rxjs';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'combineLatest',
  category: 'observable',
  examples: [
    {
      title: 'Combine array of observables',
      description: 'Combines an array of observables into one that emits arrays of their latest values.',
      code: `combineLatest([of(1), of(2), of(3)])
// emits [1, 2, 3]`,
      assert: async () => {
        let result: unknown[] | undefined;
        await new Promise<void>((resolve) => {
          combineLatest([of(1), of(2), of(3)]).subscribe((v) => {
            result = v as unknown[];
            resolve();
          });
        });
        if (!result || result.length !== 3 || result[0] !== 1) throw new Error(`Unexpected: ${result}`);
      },
    },
    {
      title: 'Handle empty array',
      description: 'Returns an observable that emits an empty array when given no sources.',
      code: `combineLatest([])
// emits []`,
      assert: async () => {
        let result: unknown[] | undefined;
        await new Promise<void>((resolve) => {
          combineLatest([]).subscribe((v) => {
            result = v as unknown[];
            resolve();
          });
        });
        if (!result || result.length !== 0) throw new Error(`Expected empty array`);
      },
    },
  ],
};

export default examples;
