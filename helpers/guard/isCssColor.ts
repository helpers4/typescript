/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { HEX_COLOR_DIGITS } from '../_shared/_hexColorGrammar.js';

const HEX_COLOR = /* @__PURE__ */ new RegExp(`^#(?:${HEX_COLOR_DIGITS})$`, 'i');
const FUNCTIONAL_COLOR = /^(?:rgb|rgba|hsl|hsla)\(\s*[\d.%,\s/-]+\s*\)$/i;
const NAMED_COLOR = /^[a-z]+$/i;

/**
 * Checks whether a value is a syntactically-safe, plain CSS color: a hex color
 * (`#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`), a functional notation (`rgb()`,
 * `rgba()`, `hsl()`, `hsla()`), or a single-word named color (`red`,
 * `rebeccapurple`).
 *
 * Intended to sanitize a color value before interpolating it into inline
 * `style`/`cssText` — it does not implement the full CSS color grammar or
 * validate named colors against the real keyword list, it only rejects
 * characters (`{`, `}`, `;`, `\`) or shapes that could smuggle extra CSS
 * declarations into the surrounding rule.
 *
 * @param value - The value to check
 * @returns `true` if value is a string that looks like a safe, plain CSS color
 * @example
 * isCssColor('#ff0000')             // => true
 * isCssColor('rgba(0, 0, 0, 0.5)')  // => true
 * isCssColor('rebeccapurple')       // => true
 * isCssColor('red; color: blue')    // => false (would inject a second declaration)
 * isCssColor(42)                    // => false (not a string)
 * @since 3.0.0
 */
export function isCssColor(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const color = value.trim();
  if (color.length === 0) return false;
  return HEX_COLOR.test(color) || FUNCTIONAL_COLOR.test(color) || NAMED_COLOR.test(color);
}
