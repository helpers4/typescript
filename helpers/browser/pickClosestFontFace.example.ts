/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { pickClosestFontFace } from './pickClosestFontFace';

const examples: HelperExamples = {
  helper: 'pickClosestFontFace',
  category: 'browser',
  examples: [
    {
      title: 'Pick the face for a weight that is not available',
      description: 'Above 500, CSS goes to the next heavier face before any lighter one.',
      code: `const faces = [{ weight: 300 }, { weight: 400 }, { weight: 700 }];
pickClosestFontFace(faces, { weight: 600 })
// => { weight: 700 }`,
      assert: () => {
        const faces = [{ weight: 300 }, { weight: 400 }, { weight: 700 }];
        if (pickClosestFontFace(faces, { weight: 600 })?.weight !== 700) throw new Error('Expected weight 700');
      },
    },
    {
      title: 'Ask for an italic, with a fallback',
      description: 'Without an italic face, oblique is tried, then normal, as in a browser.',
      code: `pickClosestFontFace([{ weight: 400 }, { weight: 400, style: 'oblique' }], { style: 'italic' })
// => { weight: 400, style: 'oblique' }`,
      assert: () => {
        const picked = pickClosestFontFace([{ weight: 400 }, { weight: 400, style: 'oblique' as const }], { style: 'italic' });
        if (picked?.style !== 'oblique') throw new Error('Expected the oblique face');
      },
    },
  ],
};

export default examples;
