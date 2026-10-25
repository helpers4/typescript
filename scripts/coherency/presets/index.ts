#!/usr/bin/env node

/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Presets package (@helpers4/presets) coherency test
 */

import { testPresetsConsumption, testPresetsPackage } from "./helper";

async function runPresetsTest() {
  try {
    console.log("🧪 Presets Package:");
    console.log("   Validates @helpers4/presets and consumes its presets");

    await testPresetsPackage();
    await testPresetsConsumption();

    console.log("✅ Presets Package passed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Presets Package failed:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the test if this script is called directly
if (import.meta.url.includes(process.argv[1]) || import.meta.url.includes('presets')) {
  runPresetsTest().catch(console.error);
}
