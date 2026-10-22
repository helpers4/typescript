/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { observeIntersection } from './observeIntersection';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'observeIntersection',
  category: 'browser',
  examples: [
    {
      title: 'Play a video only while visible',
      description: 'The callback receives the IntersectionObserverEntry of the element.',
      code: `const stop = observeIntersection(video, (entry) => (entry.isIntersecting ? video.play() : video.pause()));`,
      assert: () => {
        const stop = observeIntersection({} as Element, () => {});
        stop();
      },
    },
    {
      title: 'Lazy-load once',
      description: 'Stop observing from the callback after the first load; rootMargin starts loading early.',
      code: `const stop = observeIntersection(image, (entry) => {
  if (!entry.isIntersecting) return;
  image.src = image.dataset.src!;
  stop();
}, { rootMargin: '200px' });`,
      assert: () => {
        const stop = observeIntersection({} as Element, () => {}, { rootMargin: '200px' });
        if (typeof stop !== 'function') throw new Error('Expected a stop function');
        stop();
      },
    },
  ],
};

export default examples;
