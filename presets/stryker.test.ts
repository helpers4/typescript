/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { strykerConfig } from './stryker';

describe('strykerConfig', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('runs on Vitest, incrementally, with HTML and JSON reports', () => {
    vi.stubEnv('CI', '');
    vi.stubEnv('STRYKER_DASHBOARD_API_KEY', '');
    const config = strykerConfig();
    expect(config).toMatchObject({
      incremental: true,
      mutate: ['src/**/!(*.test|*.spec|*.bench|*.example|index).ts'],
      reporters: ['clear-text', 'progress', 'html', 'json'],
      testRunner: 'vitest'
    });
    expect(config.dashboard).toBeUndefined();
  });

  it('keeps only the progress reporter on CI', () => {
    vi.stubEnv('CI', 'true');
    expect(strykerConfig().reporters).toEqual(['progress', 'html', 'json']);
  });

  it('adds the dashboard only with both a key and a project', () => {
    vi.stubEnv('CI', '');
    vi.stubEnv('STRYKER_DASHBOARD_API_KEY', 'key');
    expect(strykerConfig().dashboard).toBeUndefined();

    const config = strykerConfig({ dashboardProject: 'github.com/owner/repo', mutate: ['lib/**/*.ts'] });
    expect(config.mutate).toEqual(['lib/**/*.ts']);
    expect(config.reporters).toContain('dashboard');
    expect(config.dashboard).toMatchObject({ project: 'github.com/owner/repo', reportType: 'full' });
  });
});
