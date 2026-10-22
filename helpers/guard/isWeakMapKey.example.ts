/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isWeakMapKey } from './isWeakMapKey';

const examples: HelperExamples = {
  helper: 'isWeakMapKey',
  category: 'guard',
  examples: [
    {
      title: 'Objects and functions are valid WeakMap keys',
      description: 'Functions pass despite typeof reporting "function" — they are objects.',
      code: `isWeakMapKey({})       // => true
isWeakMapKey(() => {}) // => true
isWeakMapKey(42)       // => false`,
      assert: () => {
        if (!isWeakMapKey({})) throw new Error('Expected an object to pass');
        if (!isWeakMapKey(() => {})) throw new Error('Expected a function to pass');
        if (isWeakMapKey(42)) throw new Error('Expected a number to fail');
      },
    },
    {
      title: 'Unregistered symbols pass, registered ones do not',
      description: 'Symbol.for(...) symbols live forever in the global registry, so the language disallows them as weak references.',
      code: `isWeakMapKey(Symbol('x'))     // => true
isWeakMapKey(Symbol.for('x')) // => false`,
      assert: () => {
        if (!isWeakMapKey(Symbol('x'))) throw new Error('Expected an unregistered symbol to pass');
        if (isWeakMapKey(Symbol.for('x'))) throw new Error('Expected a registered symbol to fail');
      },
    },
  ],
};

export default examples;
