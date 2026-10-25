/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { mixColors } from './mixColors';

const examples: HelperExamples = {
  helper: 'mixColors',
  category: 'color',
  examples: [
    {
      title: 'Tint a color toward another',
      description: 'The same as color-mix(in srgb, red 25%, blue), usable where there is no CSS engine.',
      code: `mixColors({ r: 255, g: 0, b: 0 }, { r: 0, g: 0, b: 255 }, 25)
// => { r: 64, g: 0, b: 191, a: 1 }`,
      assert: () => {
        const out = mixColors({ r: 255, g: 0, b: 0 }, { r: 0, g: 0, b: 255 }, 25);
        if (out.r !== 64 || out.g !== 0 || out.b !== 191 || out.a !== 1) throw new Error('Expected a 25% red tint');
      },
    },
    {
      title: 'Mix a translucent color',
      description: 'Alpha is interpolated in premultiplied space, as CSS Color 4 specifies.',
      code: `mixColors({ r: 255, g: 0, b: 0, a: 0.5 }, { r: 0, g: 0, b: 255 })
// => { r: 85, g: 0, b: 170, a: 0.75 }`,
      assert: () => {
        const out = mixColors({ r: 255, g: 0, b: 0, a: 0.5 }, { r: 0, g: 0, b: 255 });
        if (out.r !== 85 || out.b !== 170 || out.a !== 0.75) throw new Error('Expected a premultiplied mix');
      },
    },
  ],
};

export default examples;
