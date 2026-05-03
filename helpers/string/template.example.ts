/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { template } from './template';

template('Hello, {{name}}!', { name: 'Alice' });
// 'Hello, Alice!'

template('{{greeting}}, {{name}}! You have {{count}} messages.', {
  greeting: 'Hi',
  name: 'Bob',
  count: 3,
});
// 'Hi, Bob! You have 3 messages.'

// Unknown keys become empty string
template('Hello, {{name}}!', {});
// 'Hello, !'

// Spaces around key are trimmed
template('{{ title }}', { title: 'helpers4' });
// 'helpers4'

// Non-string values are coerced
template('Version {{v}}', { v: 2 });
// 'Version 2'
