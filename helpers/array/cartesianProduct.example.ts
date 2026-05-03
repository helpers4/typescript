/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { cartesianProduct } from './cartesianProduct';

cartesianProduct([1, 2], ['a', 'b']);
// [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]

// Generate all combinations of size / color
cartesianProduct(['S', 'M', 'L'], ['red', 'blue']);
// [['S','red'],['S','blue'],['M','red'],['M','blue'],['L','red'],['L','blue']]

// Binary combinations (2^3)
cartesianProduct([0, 1], [0, 1], [0, 1]);
// [[0,0,0],[0,0,1],[0,1,0],[0,1,1],[1,0,0],[1,0,1],[1,1,0],[1,1,1]]

// Empty input → empty output
cartesianProduct([1, 2], []); // []
