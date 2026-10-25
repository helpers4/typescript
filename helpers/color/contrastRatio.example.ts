/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { contrastRatio } from './contrastRatio';

const examples: HelperExamples = {
  helper: 'contrastRatio',
  category: 'color',
  examples: [
    {
      title: 'Black on white is the maximum contrast',
      description: 'The ratio goes from 1 (identical colors) to 21.',
      code: `contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }) // => 21`,
      assert: () => {
        if (Math.abs(contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }) - 21) > 1e-9) throw new Error('Expected 21');
      },
    },
    {
      title: 'Check a text color against the WCAG AA threshold',
      description: 'Normal text needs 4.5; #777777 on white is just under it, #767676 just over.',
      code: `const white = { r: 255, g: 255, b: 255 };
contrastRatio({ r: 0x77, g: 0x77, b: 0x77 }, white) >= 4.5 // => false (4.48)
contrastRatio({ r: 0x76, g: 0x76, b: 0x76 }, white) >= 4.5 // => true (4.54)`,
      assert: () => {
        const white = { r: 255, g: 255, b: 255 };
        if (contrastRatio({ r: 0x77, g: 0x77, b: 0x77 }, white) >= 4.5) throw new Error('Expected #777777 to fail AA');
        if (contrastRatio({ r: 0x76, g: 0x76, b: 0x76 }, white) < 4.5) throw new Error('Expected #767676 to pass AA');
      },
    },
  ],
};

export default examples;
