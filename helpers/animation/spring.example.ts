/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { spring } from './spring';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'spring',
  category: 'animation',
  examples: [
    {
      title: 'A bouncy transition',
      description: 'The duration comes from the physics: play it for durationMs.',
      code: `const bouncy = spring({ stiffness: 300, damping: 15 });
bouncy.durationMs // => about 900
bouncy.at(bouncy.durationMs) // => 1`,
      assert: () => {
        const bouncy = spring({ stiffness: 300, damping: 15 });
        if (bouncy.at(bouncy.durationMs) !== 1) throw new Error('Expected 1 once settled');
      },
    },
    {
      title: 'Drive a frame loop',
      description: 'at() takes the elapsed time in milliseconds.',
      code: `const s = spring();
const start = performance.now();
requestAnimationFrame(function frame(now) {
  draw(s.at(now - start));
  if (now - start < s.durationMs) requestAnimationFrame(frame);
});`,
      assert: () => {
        const s = spring();
        if (s.at(0) !== 0) throw new Error('Expected 0 at the start');
      },
    },
  ],
};

export default examples;
