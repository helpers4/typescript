/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { isPrerelease } from './isPrerelease';
import { parse } from './parse';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'isPrerelease',
  category: 'version',
  examples: [
    {
      title: 'Detect a prerelease version',
      description: 'Returns true for any version string that contains a prerelease suffix.',
      code: `isPrerelease('2.0.0-alpha.1') // true
isPrerelease('1.0.0-rc.0')   // true`,
      assert: () => {
        if (!isPrerelease('2.0.0-alpha.1')) throw new Error('Expected true for alpha');
        if (!isPrerelease('1.0.0-rc.0')) throw new Error('Expected true for rc');
      },
    },
    {
      title: 'Stable versions return false',
      description: 'Returns false when the version has no prerelease suffix.',
      code: `isPrerelease('1.0.0') // false
isPrerelease('2.1.3') // false`,
      assert: () => {
        if (isPrerelease('1.0.0')) throw new Error('Expected false for stable');
        if (isPrerelease('2.1.3')) throw new Error('Expected false for stable');
      },
    },
    {
      title: 'Accept a ParsedVersion object',
      description: 'Works with the result of parse() — checks the prerelease array instead of string matching.',
      code: `isPrerelease(parse('2.0.0-alpha.1')) // true
isPrerelease(parse('1.0.0'))         // false`,
      assert: () => {
        if (!isPrerelease(parse('2.0.0-alpha.1'))) throw new Error('Expected true');
        if (isPrerelease(parse('1.0.0'))) throw new Error('Expected false');
      },
    },
  ],
};

export default examples;
