/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { observeResize } from './observeResize';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'observeResize',
  category: 'browser',
  examples: [
    {
      title: 'Redraw when an element is resized',
      description: 'The callback receives the ResizeObserverEntry of the element.',
      code: `const stop = observeResize(canvas, (entry) => redraw(entry.contentRect));`,
      assert: () => {
        const stop = observeResize({} as Element, () => {});
        stop();
      },
    },
    {
      title: 'Limit how often it runs',
      description: 'Compose with debounce from helpers4/function instead of an option.',
      code: `const stop = observeResize(frame, debounce(() => fitToViewport(), 100));`,
      assert: () => {
        const stop = observeResize({} as Element, () => {});
        if (typeof stop !== 'function') throw new Error('Expected a stop function');
        stop();
      },
    },
  ],
};

export default examples;
