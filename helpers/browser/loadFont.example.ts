/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { loadFont } from './loadFont';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'loadFont',
  category: 'browser',
  examples: [
    {
      title: 'Load a web font before drawing text',
      description: 'The font is registered in document.fonts, so CSS and canvas can use it right away.',
      code: `await loadFont('Inter', '/fonts/Inter-Bold.woff2', { weight: '700' });
context.font = '700 16px Inter';`,
      assert: () => {
        if (typeof loadFont !== 'function') throw new Error('Expected a function');
      },
    },
    {
      title: 'Load embedded font bytes',
      description: 'Pass the bytes of a font file extracted from an archive or a design file.',
      code: `await loadFont('Embedded', await file.arrayBuffer());`,
      assert: async () => {
        const saved = globalThis.FontFace;
        try {
          Reflect.deleteProperty(globalThis, 'FontFace');
          const failed = await loadFont('Embedded', new ArrayBuffer(0)).then(() => false, () => true);
          if (!failed) throw new Error('Expected a rejection outside a browser');
        } finally {
          if (saved) globalThis.FontFace = saved;
        }
      },
    },
  ],
};

export default examples;
