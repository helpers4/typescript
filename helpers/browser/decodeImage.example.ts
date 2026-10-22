/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { decodeImage } from './decodeImage';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'decodeImage',
  category: 'browser',
  examples: [
    {
      title: 'Swap screens without a flash',
      description: 'Insert the image only once it is decoded.',
      code: `const image = await decodeImage('/screens/home.png');
container.replaceChildren(image);`,
      assert: () => {
        if (typeof decodeImage !== 'function') throw new Error('Expected a function');
      },
    },
    {
      title: 'Handle a broken image',
      description: 'A missing or corrupt image rejects, so it can be replaced by a placeholder.',
      code: `const image = await decodeImage(url).catch(() => placeholder);`,
      assert: async () => {
        const saved = globalThis.Image;
        try {
          Reflect.deleteProperty(globalThis, 'Image');
          const result = await decodeImage('/a.png').catch(() => 'placeholder');
          if (result !== 'placeholder') throw new Error('Expected a rejection outside a browser');
        } finally {
          if (saved) globalThis.Image = saved;
        }
      },
    },
  ],
};

export default examples;
