/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { prefersReducedMotion } from './prefersReducedMotion';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'prefersReducedMotion',
  category: 'browser',
  examples: [
    {
      title: 'Skip an animation',
      description: 'Use a zero duration when the user asked to reduce motion.',
      code: `const duration = prefersReducedMotion() ? 0 : 300;`,
      assert: () => {
        const duration = prefersReducedMotion() ? 0 : 300;
        if (duration !== 0 && duration !== 300) throw new Error('Unexpected duration');
      },
    },
    {
      title: 'React to changes',
      description: 'Combine with watchMedia to follow the setting while the page is open.',
      code: `watchMedia('(prefers-reduced-motion: reduce)', (reduce) => player.setAnimations(!reduce));`,
      assert: () => {
        if (typeof prefersReducedMotion() !== 'boolean') throw new Error('Expected a boolean');
      },
    },
  ],
};

export default examples;
