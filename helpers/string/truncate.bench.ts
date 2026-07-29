/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';
import { truncate } from './truncate';

const short = 'Hi';
const long = 'Hello, world! '.repeat(200);
const veryLong = 'Hello, world! '.repeat(2000); // ~28,000 chars
const emojiHeavy = 'Hello 👨‍👩‍👧‍👦 world 🇫🇷 flag test '.repeat(60);

// A pathologically long grapheme cluster ("Zalgo" text — a base character
// with thousands of stacked combining marks) with the cut landing in the
// middle of it. Before the window-doubling fix, this scaled with
// clusterLength/windowSize outer-loop iterations, each also paying for an
// unrelated O(cutLength) slice — 1M combining marks measured ~1.15s. Doubling
// the search window instead of relying on the caller's loop to make slow,
// repeated progress brings this back down to single-digit milliseconds.
const zalgo = 'a'.repeat(1000) + 'e' + String.fromCharCode(0x0301).repeat(200_000) + 'b'.repeat(1000);

describe('truncate', () => {
  bench('already within limit (no-op path)', () => {
    truncate(short, 10);
  });
  bench('long string, truncated near the start', () => {
    truncate(long, 50);
  });
  bench('very long string (~28k chars), cut point deep in (20k)', () => {
    // The grapheme-boundary check only segments a small window around the
    // cut point (not the whole prefix), so this stays roughly as fast as the
    // "cut near the start" case above regardless of how deep the cut is.
    truncate(veryLong, 20_000);
  });
  bench('emoji-heavy string, truncated (family/flag sequences)', () => {
    truncate(emojiHeavy, 50);
  });
  bench('pathological "Zalgo" cluster (200k combining marks), cut in the middle', () => {
    truncate(zalgo, 100_100);
  });
});
