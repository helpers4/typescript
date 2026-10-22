/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { frameLoop } from './frameLoop';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'frameLoop',
  category: 'animation',
  examples: [
    {
      title: 'Play a spring on its own clock',
      description: 'Return false from onFrame to stop; finished then resolves with true.',
      code: `const bounce = spring({ damping: 8 });
await frameLoop((elapsed) => {
  ball.style.translate = \`0 \${bounce.at(elapsed) * 200}px\`;
  return elapsed < bounce.durationMs;
}).finished;`,
      assert: async () => {
        const done = await frameLoop((elapsed) => elapsed < 20).finished;
        if (done !== true) throw new Error('Expected the loop to end by itself');
      },
    },
    {
      title: 'Cancel it',
      description: 'cancel() stops it; finished resolves with false.',
      code: `const loop = frameLoop(drawFrame);
loop.cancel();`,
      assert: async () => {
        const loop = frameLoop(() => {});
        loop.cancel();
        if ((await loop.finished) !== false) throw new Error('Expected false');
      },
    },
  ],
};

export default examples;
