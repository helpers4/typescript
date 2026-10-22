/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { tween } from './tween';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'tween',
  category: 'animation',
  examples: [
    {
      title: 'Animate what CSS cannot',
      description: 'onUpdate receives the interpolated value at each frame, here to draw on a canvas.',
      code: `await tween({
  from: { x: 0, opacity: 0 },
  to: { x: 120, opacity: 1 },
  durationMs: 400,
  easing: parseEasing('ease-out')!,
  onUpdate: ({ x, opacity }) => draw(x, opacity),
}).finished;`,
      assert: async () => {
        let last = { x: -1, opacity: -1 };
        await tween({ from: { x: 0, opacity: 0 }, to: { x: 120, opacity: 1 }, durationMs: 30, onUpdate: (value) => { last = value; } }).finished;
        if (last.x !== 120 || last.opacity !== 1) throw new Error('Expected to end on the target');
      },
    },
    {
      title: 'Cancel a running tween',
      description: 'finished resolves with false when cancelled before the end.',
      code: `const counter = tween({ from: 0, to: 1000, durationMs: 2000, onUpdate: (n) => (label.textContent = String(Math.round(n))) });
counter.cancel();
await counter.finished // => false`,
      assert: async () => {
        const counter = tween({ from: 0, to: 1000, durationMs: 2000, onUpdate: () => {} });
        counter.cancel();
        if ((await counter.finished) !== false) throw new Error('Expected false');
      },
    },
  ],
};

export default examples;
