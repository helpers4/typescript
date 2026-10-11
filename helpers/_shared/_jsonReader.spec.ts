/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import JSON5 from 'json5';
import { describe, expect, it } from 'vitest';
import { readJson } from './_jsonReader';

// Differential testing: the reference implementations (the `json5` package, a dev dependency
// only, and the native JSON.parse) must agree with ours on whether a text is valid and on the
// value it holds.

type Outcome = { ok: true; value: unknown } | { ok: false };

const outcome = (read: () => unknown): Outcome => {
  try {
    return { ok: true, value: read() };
  } catch {
    return { ok: false };
  }
};

const expectSameOutcome = (ours: Outcome, reference: Outcome): void => {
  expect(ours.ok).toBe(reference.ok);
  if (ours.ok && reference.ok) {
    // Object.is tells -0 from 0 and handles NaN; JSON.stringify compares structures.
    expect(Object.is(ours.value, reference.value) || JSON.stringify(ours.value) === JSON.stringify(reference.value)).toBe(true);
  }
};

const TOKEN_CHARS = Array.from('{}[]:,\'"\\ \t\n\r\v\f0123456789abcdefnrtuvxXEeINaify.+-/*_$\u00A0\u2028\u2029\uFEFF\u3000\u00E9\u0301\u200C\uD835\uDCB3');
const tokenSoup = fc.array(fc.constantFrom(...TOKEN_CHARS), { maxLength: 30 }).map((chars) => chars.join(''));

describe('readJson \u2014 differential', () => {
  it('json5 dialect agrees with the json5 package on random token soup', () => {
    fc.assert(fc.property(tokenSoup, (text) => {
      expectSameOutcome(outcome(() => readJson(text, { dialect: 'json5' })), outcome(() => JSON5.parse(text)));
    }), { numRuns: 5000 });
  });

  it('json5 dialect reads back what JSON5.stringify writes', () => {
    fc.assert(fc.property(fc.jsonValue(), fc.constantFrom(0, 2, '\t'), fc.constantFrom('"', "'"), (value, space, quote) => {
      const text = JSON5.stringify(value, { space, quote });
      expectSameOutcome(outcome(() => readJson(text, { dialect: 'json5' })), outcome(() => JSON5.parse(text)));
    }));
  });

  it('json dialect agrees with JSON.parse on random token soup', () => {
    fc.assert(fc.property(tokenSoup, (text) => {
      expectSameOutcome(outcome(() => readJson(text, { dialect: 'json' })), outcome(() => JSON.parse(text)));
    }), { numRuns: 5000 });
  });

  it('json dialect agrees with JSON.parse on every JSON text', () => {
    fc.assert(fc.property(fc.jsonValue(), (value) => {
      const text = JSON.stringify(value, null, 1);
      expectSameOutcome(outcome(() => readJson(text, { dialect: 'json' })), outcome(() => JSON.parse(text)));
    }));
  });

  it('I-JSON only ever narrows what the json dialect accepts', () => {
    fc.assert(fc.property(tokenSoup, (text) => {
      const strict = outcome(() => readJson(text, { dialect: 'json', iJson: true }));
      if (strict.ok) expectSameOutcome(strict, outcome(() => JSON.parse(text)));
    }), { numRuns: 5000 });
  });
});
