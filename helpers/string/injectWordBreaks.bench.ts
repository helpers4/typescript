/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { test } from 'vitest';

import { injectWordBreaks } from '@helpers4/string';
import { RUN, consume } from '../../scripts/bench';

test('injectWordBreaks', async ({ bench }) => {
  await bench.compare(
    bench('camelCase identifier', () => {
      consume(injectWordBreaks('getUserProfileData'));
    }),
    bench('file path', () => {
      consume(injectWordBreaks('path/to/my_file'));
    }),
    bench('atomic numeric value', () => {
      consume(injectWordBreaks('-0.1%'));
    }),
    bench('scientific notation with surrounding text', () => {
      consume(injectWordBreaks('Δ=-2.4E+6,avg'));
    }),
    bench('D0 protected URL', () => {
      consume(injectWordBreaks('https://example.com/foo/bar'));
    }),
    bench('long comma-separated list (stress)', () => {
      consume(injectWordBreaks('alpha,beta,gamma,delta,epsilon,zeta,eta,theta,iota,kappa'));
    }),
    bench('long camelCase identifier (stress)', () => {
      consume(injectWordBreaks('getUserProfileDataWithExtendedMetadataAndContext'));
    }),
    RUN,
  );
});
