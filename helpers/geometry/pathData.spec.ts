/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { formatPath } from './formatPath';
import { parsePath } from './parsePath';
import { transformPath } from './transformPath';
import { translate } from './translate';
import type { PathCommand } from './types';

const coordinate = fc.integer({ min: -1000, max: 1000 });
const segment = fc.oneof(
  fc.tuple(coordinate, coordinate).map(([x, y]): PathCommand => ({ type: 'L', values: [x, y] })),
  fc.tuple(coordinate, coordinate).map(([x, y]): PathCommand => ({ type: 'l', values: [x, y] })),
  fc.tuple(coordinate, coordinate, coordinate, coordinate, coordinate, coordinate).map(
    (v): PathCommand => ({ type: 'c', values: v }),
  ),
  coordinate.map((x): PathCommand => ({ type: 'H', values: [x] })),
  coordinate.map((y): PathCommand => ({ type: 'v', values: [y] })),
  fc.constant<PathCommand>({ type: 'z', values: [] }),
);
const path = fc.tuple(coordinate, coordinate, fc.array(segment, { maxLength: 12 })).map(([x, y, rest]) =>
  [{ type: 'M', values: [x, y] }].concat(rest),
);

describe('path data — property-based', () => {
  it('parsePath reads back what formatPath wrote', () => {
    fc.assert(fc.property(path, (commands) => {
      expect(parsePath(formatPath(commands))).toEqual(commands);
    }));
  });

  it('moving a path by (0, 0) and then by (dx, dy) lands on the same points as moving it once', () => {
    fc.assert(fc.property(path, coordinate, coordinate, (commands, dx, dy) => {
      const d = formatPath(commands);
      const once = transformPath(d, translate(dx, dy));
      const twice = transformPath(transformPath(d, translate(dx, 0)), translate(0, dy));
      expect(twice).toBe(once);
    }));
  });
});
