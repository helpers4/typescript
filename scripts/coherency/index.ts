#!/usr/bin/env node

/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { spawn } from 'node:child_process';

const tests = ['bundle', 'version', 'category', 'dependencies', 'sizes', 'jsdoc-since'];

function runScript(name: string, script: string): Promise<{ name: string; ok: boolean }> {
  return new Promise(resolve => {
    const child = spawn('pnpm', ['exec', 'tsx', script], {
      cwd: process.cwd(),
      stdio: 'pipe',
      shell: false,
    });
    const chunks: Buffer[] = [];
    child.stdout?.on('data', (d: Buffer) => chunks.push(d));
    child.stderr?.on('data', (d: Buffer) => chunks.push(d));
    child.on('close', code => {
      const out = Buffer.concat(chunks).toString().trim();
      if (out) process.stdout.write(`[${name}]\n${out}\n`);
      resolve({ name, ok: code === 0 });
    });
    child.on('error', (err: Error) => {
      process.stderr.write(`[${name}] spawn error: ${err.message}\n`);
      resolve({ name, ok: false });
    });
  });
}

async function runAllTests() {
  console.log("🔍 Running coherency tests in parallel...\n");

  const results = await Promise.all(
    tests.map(test => runScript(test, `scripts/coherency/${test}/index.ts`))
  );

  const failed = results.filter(r => !r.ok);

  if (failed.length === 0) {
    console.log("\n🎉 All coherency tests completed!");
  } else {
    console.error(`\n💥 ${failed.length} coherency test(s) failed:`);
    for (const f of failed) console.error(`   ✗ ${f.name}`);
    process.exit(1);
  }
}

runAllTests().catch(err => {
  console.error(err);
  process.exit(1);
});
