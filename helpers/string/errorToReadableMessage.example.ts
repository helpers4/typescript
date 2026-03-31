/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { errorToReadableMessage } from './errorToReadableMessage';
import type { HelperExamples } from '../../scripts/examples/types';

const examples: HelperExamples = {
  helper: 'errorToReadableMessage',
  category: 'string',
  examples: [
    {
      title: 'Extract message from Error object',
      description: 'Returns the stringified Error, including the class prefix.',
      code: `errorToReadableMessage(new Error('Something went wrong'))
// => 'Error: Something went wrong'`,
      assert: () => {
        const result = errorToReadableMessage(new Error('Something went wrong'));
        if (result !== 'Error: Something went wrong') throw new Error(`Unexpected: ${result}`);
      },
    },
    {
      title: 'Handle string errors',
      description: 'Returns the string directly when the error is a plain string.',
      code: `errorToReadableMessage('plain error')
// => 'plain error'`,
      assert: () => {
        const result = errorToReadableMessage('plain error');
        if (result !== 'plain error') throw new Error(`Unexpected: ${result}`);
      },
    },
    {
      title: 'Stringify unknown errors',
      description: 'When stringify is true, falls back to JSON.stringify for unrecognized errors.',
      code: `errorToReadableMessage(42, true)
// => '42'`,
      assert: () => {
        const result = errorToReadableMessage(42, true);
        if (result !== '42') throw new Error(`Unexpected: ${result}`);
      },
    },
  ],
};

export default examples;
