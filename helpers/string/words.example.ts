/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { words } from './words';

words('hello world');      // ['hello', 'world']
words('camelCaseString');  // ['camel', 'Case', 'String']
words('PascalCase');       // ['Pascal', 'Case']
words('snake_case');       // ['snake', 'case']
words('kebab-case');       // ['kebab', 'case']
words('SCREAMING_SNAKE');  // ['SCREAMING', 'SNAKE']
words('XMLParser');        // ['XML', 'Parser']
words('foo123bar');        // ['foo', '123', 'bar']

// Build a camelCase from arbitrary input
const toCamel = (str: string) =>
  words(str)
    .map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()))
    .join('');
toCamel('hello-world'); // 'helloWorld'
toCamel('FOO_BAR_BAZ'); // 'fooBarBaz'
