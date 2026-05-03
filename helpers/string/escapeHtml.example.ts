/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { escapeHtml } from './escapeHtml';

escapeHtml('<script>alert("xss")</script>');
// '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'

escapeHtml("It's a <test> & more");
// "It&#39;s a &lt;test&gt; &amp; more"

// Safe interpolation in a template string
const userInput = '<b>bold</b>';
escapeHtml(userInput); // '&lt;b&gt;bold&lt;/b&gt;'
