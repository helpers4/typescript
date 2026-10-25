/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isValid } from './isValid';

const examples: HelperExamples = {
  helper: 'isValid',
  category: 'version',
  examples: [
    {
      title: 'Validate a release version strictly',
      description: 'Unlike parse, which reads anything, isValid refuses a v prefix, missing parts and leading zeros.',
      code: `isValid('1.2.3')    // => true
isValid('v1.2.3')   // => false
isValid('garbage')  // => false`,
      assert: () => {
        if (!isValid('1.2.3') || isValid('v1.2.3') || isValid('garbage')) throw new Error('Expected true, false, false');
      },
    },
    {
      title: 'Validate in another scheme',
      description: 'Debian versions are checked against dpkg\'s grammar.',
      code: `isValid('1:2.30~rc1-3', 'debian') // => true
isValid('1.0_1', 'debian')        // => false`,
      assert: () => {
        if (!isValid('1:2.30~rc1-3', 'debian') || isValid('1.0_1', 'debian')) throw new Error('Expected true, false');
      },
    },
  ],
};

export default examples;
