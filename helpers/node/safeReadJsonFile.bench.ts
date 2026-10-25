/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, test } from 'vitest';
import { safeReadJsonFile } from '@helpers4/node';
import { RUN, consume } from '../../scripts/bench';

const dir = mkdtempSync(join(tmpdir(), 'helpers4-bench-'));

const smallObject = { name: 'helpers4', version: '3.0.6', private: false };
const largeObject = Object.fromEntries(
  Array.from({ length: 1_000 }, (_, i) => [`key${i}`, { id: i, value: `item-${i}`, active: i % 2 === 0 }]),
);

const smallJsonPath = join(dir, 'small.json');
writeFileSync(smallJsonPath, JSON.stringify(smallObject));

const largeJsonPath = join(dir, 'large.json');
writeFileSync(largeJsonPath, JSON.stringify(largeObject));

const smallJsoncPath = join(dir, 'small.jsonc');
writeFileSync(
  smallJsoncPath,
  '{\n  // package metadata\n  "name": "helpers4",\n  "version": "3.0.6",\n  "private": false,\n}',
);

const largeJsoncEntries = Array.from(
  { length: 1_000 },
  (_, i) => `"key${i}": { "id": ${i}, "value": "item-${i}", "active": ${i % 2 === 0} },`,
).join('\n  ');
const largeJsoncPath = join(dir, 'large.jsonc');
writeFileSync(largeJsoncPath, `{\n  // 1000 generated entries\n  ${largeJsoncEntries}\n}`);

const missingPath = join(dir, 'missing.json');

afterAll(() => {
  rmSync(dir, { recursive: true, force: true });
});

test('safeReadJsonFile', async ({ bench }) => {
  await bench.compare(
    bench('small file, strict JSON (fast path)', () => {
      consume(safeReadJsonFile(smallJsonPath));
    }),
    bench('small file, JSONC — comments + trailing comma (fallback path)', () => {
      consume(safeReadJsonFile(smallJsoncPath));
    }),
    bench('large file (1000 keys), strict JSON (fast path)', () => {
      consume(safeReadJsonFile(largeJsonPath));
    }),
    bench('large file (1000 keys), JSONC (fallback path)', () => {
      consume(safeReadJsonFile(largeJsoncPath));
    }),
    bench('missing file (falls back to null)', () => {
      consume(safeReadJsonFile(missingPath));
    }),
    RUN,
  );
});
