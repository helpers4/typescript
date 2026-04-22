#!/usr/bin/env node

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * JSDoc @since coherency test
 *
 * Rules enforced:
 *   - Every helper source file must contain a @since JSDoc tag.
 *   - New files (vs origin/main) must use `@since next`.
 *   - A real version on a new file is flagged as a likely copy-paste mistake.
 *   - Existing files must not carry `@since next`.
 */

import { checkJsDocSince } from './helper';

async function runJsDocSinceTest() {
  try {
    console.log('🧪 JSDoc @since:');
    console.log('   Ensures every helper has a @since tag and new files use @since next');

    await checkJsDocSince();

    console.log('✅ JSDoc @since passed');
    process.exit(0);
  } catch (error) {
    console.error('❌ JSDoc @since failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

if (import.meta.url.includes(process.argv[1]) || import.meta.url.includes('jsdoc-since')) {
  runJsDocSinceTest().catch(console.error);
}
