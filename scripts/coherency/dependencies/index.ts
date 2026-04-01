#!/usr/bin/env node

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Dependencies Coherency test
 */

import { testDependenciesCoherency } from "./helper";

async function runDependenciesTest() {
  try {
    console.log("🧪 Dependencies Coherency:");
    console.log("   Checks dependencies consistency across packages");

    await testDependenciesCoherency();

    console.log("✅ Dependencies Coherency passed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Dependencies Coherency failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the test if this script is called directly
if (import.meta.url.includes(process.argv[1]) || import.meta.url.includes('dependencies')) {
  runDependenciesTest().catch(console.error);
}