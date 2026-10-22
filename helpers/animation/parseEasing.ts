/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { cubicBezier } from './cubicBezier';
import { steps } from './steps';
import type { StepPosition } from './steps';

const KEYWORDS: Record<string, () => (t: number) => number> = {
  linear: () => (t) => Math.min(1, Math.max(0, t)),
  ease: () => cubicBezier(0.25, 0.1, 0.25, 1),
  'ease-in': () => cubicBezier(0.42, 0, 1, 1),
  'ease-out': () => cubicBezier(0, 0, 0.58, 1),
  'ease-in-out': () => cubicBezier(0.42, 0, 0.58, 1),
  'step-start': () => steps(1, 'jump-start'),
  'step-end': () => steps(1, 'jump-end'),
};

const FUNCTION = /^([a-z-]+)\(([^()]*)\)$/;
const NUMBER = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/;
const POSITIONS = new Set(['jump-start', 'jump-end', 'jump-none', 'jump-both', 'start', 'end']);

/**
 * Reads a CSS easing into an easing function, to play in JavaScript the timing a stylesheet or a
 * design tool export describes. It is the inverse of {@link toCssLinear}.
 *
 * Accepts every CSS `<easing-function>`:
 * - the keywords `linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`, `step-start`, `step-end`;
 * - `cubic-bezier(x1, y1, x2, y2)` (see {@link cubicBezier});
 * - `steps(count[, position])` (see {@link steps});
 * - `linear(0, 0.25 40%, 1)`: points with optional input positions, as CSS fills them in.
 *
 * Case and extra spaces are ignored. The input is clamped to `[0, 1]`.
 *
 * @param css - The CSS easing
 * @returns The easing function, or `null` if `css` is not a valid CSS easing
 * @example
 * parseEasing('ease-out')!(0.5)                    // => 0.6846...
 * parseEasing('cubic-bezier(0.34, 1.56, 0.64, 1)') // overshoots past 1
 * parseEasing('steps(4, jump-start)')!(0.3)        // => 0.5
 * parseEasing('linear(0, 0.9 50%, 1)')!(0.25)      // => 0.45
 * parseEasing('bounce')                            // => null
 * @since next
 */
export function parseEasing(css: string): ((t: number) => number) | null {
  const value = css.trim().toLowerCase();
  if (Object.hasOwn(KEYWORDS, value)) return KEYWORDS[value]!();
  const call = FUNCTION.exec(value);
  if (!call) return null;
  const args = call[2]!.split(',').map((arg) => arg.trim());
  switch (call[1]) {
    case 'cubic-bezier':
      return parseCubicBezier(args);
    case 'steps':
      return parseSteps(args);
    case 'linear':
      return parseLinear(args);
    default:
      return null;
  }
}

function parseCubicBezier(args: string[]): ((t: number) => number) | null {
  if (args.length !== 4 || !args.every((arg) => NUMBER.test(arg))) return null;
  const [x1, y1, x2, y2] = args.map(Number) as [number, number, number, number];
  if (x1 < 0 || x1 > 1 || x2 < 0 || x2 > 1) return null;
  return cubicBezier(x1, y1, x2, y2);
}

function parseSteps(args: string[]): ((t: number) => number) | null {
  if (args.length > 2 || !/^\d+$/.test(args[0]!)) return null;
  const position = (args[1] ?? 'jump-end') as StepPosition;
  if (!POSITIONS.has(position)) return null;
  const count = Number(args[0]);
  if (count < (position === 'jump-none' ? 2 : 1)) return null;
  return steps(count, position);
}

function parseLinear(args: string[]): ((t: number) => number) | null {
  // Each stop is an output value followed by zero, one or two input percentages.
  const points: { output: number; input: number | undefined }[] = [];
  for (const arg of args) {
    const [output, ...inputs] = arg.split(/\s+/);
    if (!NUMBER.test(output!) || inputs.length > 2) return null;
    if (inputs.length === 0) points.push({ output: Number(output), input: undefined });
    for (const input of inputs) {
      if (!input.endsWith('%') || !NUMBER.test(input.slice(0, -1))) return null;
      points.push({ output: Number(output), input: Number(input.slice(0, -1)) / 100 });
    }
  }
  if (points.length < 2) return null;

  // CSS rules: the first input defaults to 0 and the last to 1, an input is never below an
  // earlier one, and missing ones are spread evenly between their neighbors.
  points[0]!.input ??= 0;
  points.at(-1)!.input ??= 1;
  let highest = -Infinity;
  for (const point of points) {
    if (point.input === undefined) continue;
    highest = Math.max(highest, point.input);
    point.input = highest;
  }
  for (let i = 1; i < points.length; i++) {
    if (points[i]!.input !== undefined) continue;
    let next = i;
    while (points[next]!.input === undefined) next++;
    const from = points[i - 1]!.input!;
    const gap = (points[next]!.input! - from) / (next - i + 1);
    for (let k = i; k < next; k++) points[k]!.input = from + gap * (k - i + 1);
  }

  const stops = points as { output: number; input: number }[];
  return (t) => {
    const input = Math.min(1, Math.max(0, t));
    if (input <= stops[0]!.input) return stops[0]!.output;
    if (input >= stops.at(-1)!.input) return stops.at(-1)!.output;
    // The last stop at or before the input; the next one is strictly after it.
    let i = 0;
    while (stops[i + 1]!.input <= input) i++;
    const a = stops[i]!;
    const b = stops[i + 1]!;
    return a.output + ((b.output - a.output) * (input - a.input)) / (b.input - a.input);
  };
}
