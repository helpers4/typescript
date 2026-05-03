/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { countBy } from './countBy';

countBy([1, 2, 3, 4, 5], (n) => (n % 2 === 0 ? 'even' : 'odd'));
// { odd: 3, even: 2 }

countBy(['foo', 'bar', 'baz', 'qux'], (s) => s[0]);
// { f: 1, b: 2, q: 1 }

// Count commit types in a list
const commits = ['feat: add x', 'fix: bug', 'feat: add y', 'docs: update', 'fix: crash'];
countBy(commits, (msg) => msg.split(':')[0]);
// { feat: 2, fix: 2, docs: 1 }

// Count by boolean condition
countBy([1, -2, 3, -4, 5], (n) => (n > 0 ? 'positive' : 'negative'));
// { positive: 3, negative: 2 }
