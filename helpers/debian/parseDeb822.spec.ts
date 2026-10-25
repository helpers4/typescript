/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { parseDeb822 } from './parseDeb822';

const fieldName = fc.stringMatching(/^[A-Za-z][A-Za-z0-9-]{0,8}$/);
const word = fc.stringMatching(/^[A-Za-z0-9][A-Za-z0-9 ._-]{0,12}[A-Za-z0-9]$/);
const field = fc.tuple(fieldName, word, fc.array(word, { maxLength: 3 }));
const stanza = fc.array(field, { minLength: 1, maxLength: 5 });

function render(stanzas: [string, string, string[]][][], separator: string): string {
  return stanzas
    .map((fields) => fields.map(([name, value, more]) => [`${name}: ${value}`, ...more.map((line) => ` ${line}`)].join('\n')).join('\n'))
    .join(separator);
}

describe('parseDeb822 — property-based', () => {
  it('never throws on arbitrary text in the default mode', () => {
    fc.assert(fc.property(fc.string({ unit: 'binary' }), (text) => {
      expect(Array.isArray(parseDeb822(text))).toBe(true);
    }));
    fc.assert(fc.property(fc.string(), (text) => {
      expect(Array.isArray(parseDeb822(text))).toBe(true);
    }));
  });

  it('only throws a SyntaxError in strict mode', () => {
    fc.assert(fc.property(fc.string(), (text) => {
      try {
        parseDeb822(text, { strict: true });
      } catch (error) {
        expect(error).toBeInstanceOf(SyntaxError);
      }
    }));
  });

  it('finds as many stanzas as there are blank-line separated blocks', () => {
    fc.assert(fc.property(
      fc.array(stanza, { maxLength: 6 }),
      fc.constantFrom('\n\n', '\n\n\n', '\n \n', '\n\t\n\n'),
      (stanzas, separator) => {
        expect(parseDeb822(render(stanzas, separator))).toHaveLength(stanzas.length);
        expect(parseDeb822(render(stanzas, separator).replaceAll('\n', '\r\n'))).toHaveLength(stanzas.length);
      },
    ));
  });

  it('keeps every field, in order, with its value and continuation lines', () => {
    fc.assert(fc.property(stanza, (fields) => {
      const [parsed] = parseDeb822(render([fields], '\n\n'));
      expect(parsed!.entries.map((entry) => entry.name)).toEqual(fields.map(([name]) => name));
      expect(parsed!.entries.map((entry) => entry.value)).toEqual(
        fields.map(([, value, more]) => [value, ...more].join('\n')),
      );
      expect(parsed!.unparsed).toEqual([]);
    }));
  });

  it('is not affected by comment lines between the lines of a document', () => {
    fc.assert(fc.property(fc.array(stanza, { minLength: 1, maxLength: 4 }), (stanzas) => {
      const text = render(stanzas, '\n\n');
      const commented = text.split('\n').flatMap((line) => (line === '' ? [line] : ['# comment', line])).join('\n');
      expect(parseDeb822(commented)).toEqual(parseDeb822(text));
    }));
  });
});
