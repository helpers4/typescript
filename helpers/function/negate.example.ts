/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { negate } from './negate';

// Derive isOdd from isEven
const isEven = (n: number) => n % 2 === 0;
const isOdd = negate(isEven);
isOdd(3); // true
isOdd(4); // false

// Use as a filter predicate
const isEmpty = (arr: unknown[]) => arr.length === 0;
[[], [1], [], [2, 3]].filter(negate(isEmpty)); // [[1], [2, 3]]

// Negate a string predicate
const isBlank = (s: string) => s.trim().length === 0;
['hello', '  ', 'world', ''].filter(negate(isBlank)); // ['hello', 'world']
