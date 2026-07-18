/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { bench, describe } from 'vitest';

import { incrementPrerelease } from './incrementPrerelease';

describe('incrementPrerelease', () => {
  bench('start new prerelease line', () => {
    incrementPrerelease('1.2.3', 'alpha');
  });

  bench('increment same prerelease type', () => {
    incrementPrerelease('1.2.4-alpha.5', 'alpha');
  });

  bench('switch prerelease type', () => {
    incrementPrerelease('1.2.4-alpha.3', 'beta');
  });

  bench('with leading v prefix', () => {
    incrementPrerelease('v1.2.4-alpha.0', 'alpha');
  });

  bench('with build metadata', () => {
    incrementPrerelease('1.2.4-alpha.0+sha.abc123', 'alpha');
  });

  bench('null and undefined pass through', () => {
    incrementPrerelease(null, 'alpha');
    incrementPrerelease(undefined, 'alpha');
  });
});
