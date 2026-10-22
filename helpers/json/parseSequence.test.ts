/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { parseSequence } from './parseSequence';

const RS = '\u001E';

describe('parseSequence', () => {
  it('parses one value per record', () => {
    expect(parseSequence(`${RS}{"id":1}\n${RS}[2]\n${RS}"three"\n`)).toEqual([{ id: 1 }, [2], 'three']);
  });

  it('parses a value spread over several lines inside a record', () => {
    expect(parseSequence(`${RS}{\n  "a": 1\n}\n`)).toEqual([{ a: 1 }]);
  });

  it('returns an empty array for an empty text', () => {
    expect(parseSequence('')).toEqual([]);
  });

  it('ignores empty records between consecutive separators', () => {
    expect(parseSequence(`${RS}${RS}1\n${RS}`)).toEqual([1]);
  });

  it('accepts whitespace before the first separator', () => {
    expect(parseSequence(`\n${RS}1\n`)).toEqual([1]);
  });

  it('accepts a self-delimited value without trailing whitespace', () => {
    expect(parseSequence(`${RS}{"a":1}${RS}"s"${RS}[1]`)).toEqual([{ a: 1 }, 's', [1]]);
  });

  it.each(['123', 'true', 'false', 'null'])('rejects a top-level %s not followed by whitespace (RFC 7464 §2.4)', (value) => {
    expect(() => parseSequence(`${RS}${value}${RS}1\n`)).toThrow(/record 1: top-level .* may be truncated/);
  });

  it.each(['123', 'true', 'false', 'null'])('accepts a top-level %s followed by whitespace', (value) => {
    expect(parseSequence(`${RS}${value}\n`)).toEqual([JSON.parse(value)]);
  });

  it('fails on text before the first separator', () => {
    expect(() => parseSequence('1\n')).toThrow('parseSequence: before the first record');
  });

  it('fails on an invalid record by default, naming it and keeping the cause', () => {
    let error: unknown;
    try {
      parseSequence(`${RS}1\n${RS}{"a"\n`);
    } catch (caught) {
      error = caught;
    }
    expect(error).toBeInstanceOf(SyntaxError);
    expect((error as Error).message).toMatch(/^parseSequence: record 2: /);
    expect((error as Error).cause).toBeInstanceOf(SyntaxError);
  });

  it('fails on a whitespace-only record', () => {
    expect(() => parseSequence(`${RS} \n`)).toThrow(/record 1/);
  });

  it('has no cause for a truncation error', () => {
    try {
      parseSequence(`${RS}12`);
    } catch (error) {
      expect((error as Error).cause).toBeUndefined();
    }
    expect.assertions(1);
  });

  it('skips invalid records with invalidRecords: "skip"', () => {
    expect(parseSequence(`junk${RS}1\n${RS}{"a"\n${RS}12${RS}3\n`, { invalidRecords: 'skip' })).toEqual([1, 3]);
  });
});
