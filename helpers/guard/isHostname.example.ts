/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { isHostname } from './isHostname';

const examples: HelperExamples = {
  helper: 'isHostname',
  category: 'guard',
  examples: [
    {
      title: 'Validate a hostname typed by a user',
      description: 'Accepts DNS hostnames and single labels; refuses IPv4 addresses, ports and schemes.',
      code: `isHostname('example.com')        // => true
isHostname('localhost')          // => true
isHostname('192.168.0.1')        // => false (numeric TLD)
isHostname('example.com:80')     // => false
isHostname('http://example.com') // => false`,
      assert: () => {
        if (!isHostname('example.com')) throw new Error('Expected example.com to be valid');
        if (!isHostname('localhost')) throw new Error('Expected localhost to be valid');
        if (isHostname('192.168.0.1')) throw new Error('Expected an IPv4 address to be refused');
        if (isHostname('example.com:80')) throw new Error('Expected a port to be refused');
        if (isHostname('http://example.com')) throw new Error('Expected a scheme to be refused');
      },
    },
    {
      title: 'Accept a trailing dot or an underscore on demand',
      description: 'Fully qualified names and service names such as _dmarc are refused unless the option is set.',
      code: `isHostname('example.com.')                                  // => false
isHostname('example.com.', { allowTrailingDot: true })      // => true
isHostname('_dmarc.example.com')                            // => false
isHostname('_dmarc.example.com', { allowUnderscore: true }) // => true`,
      assert: () => {
        if (isHostname('example.com.')) throw new Error('Expected trailing dot to be refused by default');
        if (!isHostname('example.com.', { allowTrailingDot: true }))
          throw new Error('Expected trailing dot to be accepted');
        if (isHostname('_dmarc.example.com')) throw new Error('Expected underscore to be refused by default');
        if (!isHostname('_dmarc.example.com', { allowUnderscore: true }))
          throw new Error('Expected underscore to be accepted');
      },
    },
    {
      title: 'Check an internationalised name',
      description: 'Unicode labels are refused; convert them to punycode with URL first.',
      code: `isHostname('bücher.example')                           // => false
isHostname(new URL('https://bücher.example').hostname) // => true`,
      assert: () => {
        if (isHostname('bücher.example')) throw new Error('Expected Unicode to be refused');
        if (!isHostname(new URL('https://bücher.example').hostname))
          throw new Error('Expected punycode to be accepted');
      },
    },
  ],
};

export default examples;
