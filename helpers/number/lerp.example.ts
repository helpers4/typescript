/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { lerp } from './lerp';

lerp(0, 100, 0);    // 0
lerp(0, 100, 0.5);  // 50
lerp(0, 100, 1);    // 100

// Animate opacity from 0 to 1 over a progress value
const progress = 0.3;
lerp(0, 1, progress); // 0.3

// Transition color channel
lerp(0, 255, 0.5); // 127.5

// Extrapolation (t outside [0, 1])
lerp(0, 10, 2);  // 20
lerp(0, 10, -1); // -10
