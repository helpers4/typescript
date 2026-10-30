/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { PathCommand } from './types';

const ARITY: Record<string, number> = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 };
const NUMBER = /[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/y;
const FLAG = /[01]/y;

/**
 * Parses SVG path data (the `d` attribute) into commands, as written: the letters keep their case
 * (absolute or relative), `H`/`V`/`S`/`T`/`A` stay what they are, and a command repeated without
 * its letter (`L 1 2 3 4`) becomes one command per set of numbers (`M` repeats as `L`, `m` as `l`).
 *
 * It follows the SVG grammar: numbers may be glued (`1-2`, `.5.5`, `1e-3`), separators are
 * optional, and the two arc flags may be written without any separator (`a1 1 0 011 1`).
 *
 * @param d - The path data
 * @returns The commands, in order. Empty for an empty or blank string
 * @throws {SyntaxError} If the data does not start with a move, has an unknown letter, or misses numbers
 * @example
 * parsePath('M0 0h10v10z')
 * // => [{ type: 'M', values: [0, 0] }, { type: 'h', values: [10] }, { type: 'v', values: [10] }, { type: 'z', values: [] }]
 * @since 3.1.10
 */
export function parsePath(d: string): PathCommand[] {
  const commands: PathCommand[] = [];
  let i = 0;
  const skip = (): void => {
    while (i < d.length && /[\s,]/.test(d[i]!)) i++;
  };
  const fail = (what: string): never => {
    throw new SyntaxError(`parsePath: ${what} at ${i}`);
  };
  skip();
  while (i < d.length) {
    const letter = d[i]!;
    const arity = ARITY[letter.toLowerCase()];
    if (arity === undefined) fail(`unexpected "${letter}"`);
    if (commands.length === 0 && letter !== 'M' && letter !== 'm') fail('path data must start with a move');
    i++;
    const hasMoreNumbers = (): boolean => arity! > 0 && i < d.length && !/[A-Za-z]/.test(d[i]!);
    let type = letter;
    let first = true;
    do {
      const values: number[] = [];
      for (let k = 0; k < arity!; k++) {
        skip();
        const flag = letter.toLowerCase() === 'a' && (k === 3 || k === 4);
        const pattern = flag ? FLAG : NUMBER;
        pattern.lastIndex = i;
        const match = pattern.exec(d);
        if (!match) fail(`expected a ${flag ? 'flag' : 'number'}`);
        values.push(Number(match![0]));
        i = pattern.lastIndex;
      }
      commands.push({ type, values });
      if (first && (letter === 'M' || letter === 'm')) type = letter === 'M' ? 'L' : 'l';
      first = false;
      skip();
    } while (hasMoreNumbers());
  }
  return commands;
}
