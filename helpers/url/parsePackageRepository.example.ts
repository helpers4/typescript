/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { parsePackageRepository } from './parsePackageRepository';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'parsePackageRepository',
  category: 'url',
  examples: [
    {
      title: 'Parse the npm canonical object form',
      description: 'Parses the full object form written by npm publish.',
      code: `parsePackageRepository({ type: 'git', url: 'git+https://github.com/helpers4/typescript.git' })
// => { type: 'git', host: 'github', slug: 'helpers4/typescript',
//      owner: 'helpers4', repo: 'typescript', gistId: undefined, directory: undefined }`,
      assert: () => {
        const result = parsePackageRepository({
          type: 'git',
          url: 'git+https://github.com/helpers4/typescript.git',
        });
        if (result?.host !== 'github') throw new Error(`Unexpected host: ${result?.host}`);
        if (result?.slug !== 'helpers4/typescript') throw new Error(`Unexpected slug: ${result?.slug}`);
      },
    },
    {
      title: 'Parse npm shorthand forms',
      description: 'npm accepts "owner/repo", "github:owner/repo", "gitlab:owner/repo" etc. as shorthand.',
      code: `parsePackageRepository('helpers4/typescript')
// => { host: 'github', slug: 'helpers4/typescript', owner: 'helpers4', repo: 'typescript', ... }

parsePackageRepository('gitlab:myorg/myproject')
// => { host: 'gitlab', slug: 'myorg/myproject', owner: 'myorg', repo: 'myproject', ... }

parsePackageRepository('gist:11081aaa281')
// => { host: 'gist', gistId: '11081aaa281', slug: undefined, owner: undefined, ... }`,
      assert: () => {
        const gh = parsePackageRepository('helpers4/typescript');
        if (gh?.host !== 'github' || gh?.slug !== 'helpers4/typescript')
          throw new Error('Bare shorthand failed');

        const gl = parsePackageRepository('gitlab:myorg/myproject');
        if (gl?.host !== 'gitlab') throw new Error('GitLab shorthand failed');

        const gist = parsePackageRepository('gist:11081aaa281');
        if (gist?.gistId !== '11081aaa281' || gist?.slug !== undefined)
          throw new Error('Gist shorthand failed');
      },
    },
  ],
};

export default examples;
