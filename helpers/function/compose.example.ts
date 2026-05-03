/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { compose } from './compose';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'compose',
  category: 'function',
  examples: [
    {
      title: 'Compose functions right-to-left',
      description: '`compose(f, g)(x)` is equivalent to `f(g(x))`. The rightmost function is applied first.',
      code: `const process = compose(
  String,
  (x: number) => x * 2,
  (x: number) => x + 1
);
process(3); // => "8"`,
      assert: () => {
        const process = compose(
          String,
          (x: number) => x * 2,
          (x: number) => x + 1
        );
        if (process(3) !== '8') throw new Error('Expected "8"');
      },
    },
    {
      title: 'Build a validator from small predicates',
      code: `const validate = compose(
  (ok: boolean) => ok || (() => { throw new Error('invalid'); })(),
  (s: string) => s.length >= 3
);
validate('ab');  // throws
validate('abc'); // => true`,
      assert: () => {
        const validate = compose(
          (ok: boolean) => ok || (() => { throw new Error('invalid'); })(),
          (s: string) => s.length >= 3
        );
        if (validate('abc') !== true) throw new Error('Expected true for valid input');
        let threw = false;
        try { validate('ab'); } catch { threw = true; }
        if (!threw) throw new Error("Expected validate('ab') to throw for short input");
      },
    },
  ],
};

export default examples;
