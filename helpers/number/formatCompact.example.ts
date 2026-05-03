/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { formatCompact } from './formatCompact';

formatCompact(1_500_000, 'en'); // '1.5M'
formatCompact(1_000, 'en');     // '1K'
formatCompact(999, 'en');       // '999'
formatCompact(0, 'en');         // '0'

// Display GitHub star counts
const stars = 12_400;
formatCompact(stars, 'en'); // '12.4K stars'

// French locale
formatCompact(1_500_000, 'fr'); // '1,5 M'
