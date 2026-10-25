/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { sortVersions } from './sortVersions';

const examples: HelperExamples = {
  helper: 'sortVersions',
  category: 'version',
  examples: [
    {
      title: 'Sort versions, not strings',
      description: '1.10.0 comes after 1.9.0, which a plain sort() gets wrong.',
      code: `sortVersions(['1.10.0', '1.2.0', '1.9.0'])
// => ['1.2.0', '1.9.0', '1.10.0']`,
      assert: () => {
        if (sortVersions(['1.10.0', '1.2.0', '1.9.0']).join() !== '1.2.0,1.9.0,1.10.0') throw new Error('Expected 1.2.0,1.9.0,1.10.0');
      },
    },
    {
      title: 'Find the latest tag',
      description: 'Newest first; the v prefix of git tags is kept.',
      code: `sortVersions(['v1.0.0', 'v2.0.0-rc.1', 'v1.5.0'], { order: 'desc' })[0]
// => 'v2.0.0-rc.1'`,
      assert: () => {
        if (sortVersions(['v1.0.0', 'v2.0.0-rc.1', 'v1.5.0'], { order: 'desc' })[0] !== 'v2.0.0-rc.1') throw new Error('Expected v2.0.0-rc.1');
      },
    },
  ],
};

export default examples;
