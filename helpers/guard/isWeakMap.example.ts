/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isWeakMap } from './isWeakMap';

const examples: HelperExamples = {
  helper: 'isWeakMap',
  category: 'guard',
  examples: [
    {
      title: 'Check whether a value is a WeakMap',
      description: 'Distinguishes WeakMap from the regular (iterable) Map.',
      code: `isWeakMap(new WeakMap()) // => true
isWeakMap(new Map())     // => false`,
      assert: () => {
        if (!isWeakMap(new WeakMap())) throw new Error('Expected a WeakMap to pass');
        if (isWeakMap(new Map())) throw new Error('Expected a Map to fail');
      },
    },
    {
      title: 'Plain objects are not WeakMaps',
      description: 'Only real WeakMap instances pass, not objects that merely look like one.',
      code: `isWeakMap({ get: () => undefined, set: () => {} })
// => false`,
      assert: () => {
        if (isWeakMap({ get: () => undefined, set: () => {} })) throw new Error('Expected a plain object to fail');
      },
    },
  ],
};

export default examples;
