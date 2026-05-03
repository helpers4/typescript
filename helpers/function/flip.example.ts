/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { flip } from './flip';

// Swap argument order of a subtraction function
const sub = (a: number, b: number) => a - b;
const flippedSub = flip(sub);
flippedSub(3, 10); // 7  (10 - 3)
flippedSub(10, 3); // -7 (3 - 10)

// Useful for adapting callbacks in higher-order functions
const divide = (a: number, b: number) => a / b;
const divideInto = flip(divide); // divideInto(divisor, dividend) = dividend / divisor
divideInto(2, 100); // 50

// Three-argument: only first two are swapped
const fn = (a: string, b: string, c: string) => `${a}-${b}-${c}`;
flip(fn)('B', 'A', 'C'); // 'A-B-C'
