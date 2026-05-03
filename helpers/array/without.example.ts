/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { without } from './without';

without([1, 2, 3, 2, 4], 2);    // [1, 3, 4]
without([1, 2, 3, 2, 4], 2, 3); // [1, 4]

// Removing sentinel values from a status list
type Status = 'pending' | 'running' | 'done' | 'failed';
const statuses: Status[] = ['pending', 'running', 'done', 'failed', 'done'];
without(statuses, 'pending', 'running'); // ['done', 'failed', 'done']

// Works with strings
without(['a', 'b', 'c', 'b', 'd'], 'b'); // ['a', 'c', 'd']
