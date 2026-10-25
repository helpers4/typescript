/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { parseDeb822 } from './parseDeb822';

const PACKAGES = `Package: zlib1g
Source: zlib
Version: 1:1.2.13.dfsg-1
Installed-Size: 158
Maintainer: Mark Brown <broonie@debian.org>
Architecture: amd64
Depends: libc6 (>= 2.14)
Description: compression library - runtime
 zlib is a library implementing the deflate compression method found
 in gzip and PKZIP.  This package includes the shared library.
 .
 This is the second paragraph.
Homepage: http://zlib.net/
SHA256: 0f1e6b3d

Package: python3
Version: 3.11.2-1+b1
Depends: python3.11 (>= 3.11.2-1~), libpython3-stdlib (= 3.11.2-1+b1),
 foo | bar
Multi-Arch: allowed
`;

describe('parseDeb822', () => {
  it('parses a Packages excerpt into stanzas', () => {
    const stanzas = parseDeb822(PACKAGES);
    expect(stanzas).toHaveLength(2);
    const [zlib, python] = stanzas;
    expect(zlib!.entries.map((entry) => entry.name)).toEqual([
      'Package', 'Source', 'Version', 'Installed-Size', 'Maintainer', 'Architecture', 'Depends', 'Description', 'Homepage', 'SHA256',
    ]);
    expect(zlib!.fields.package).toBe('zlib1g');
    expect(zlib!.fields.version).toBe('1:1.2.13.dfsg-1');
    expect(zlib!.fields.maintainer).toBe('Mark Brown <broonie@debian.org>');
    expect(python!.fields['multi-arch']).toBe('allowed');
    expect(zlib!.unparsed).toEqual([]);
  });

  it('keeps the line breaks of a multi-line value and turns " ." into a blank line', () => {
    const [zlib] = parseDeb822(PACKAGES);
    expect(zlib!.fields.description).toBe(
      'compression library - runtime\n'
      + 'zlib is a library implementing the deflate compression method found\n'
      + 'in gzip and PKZIP.  This package includes the shared library.\n'
      + '\n'
      + 'This is the second paragraph.',
    );
  });

  it('keeps the continuation of a Depends field', () => {
    const [, python] = parseDeb822(PACKAGES);
    expect(python!.fields.depends).toBe('python3.11 (>= 3.11.2-1~), libpython3-stdlib (= 3.11.2-1+b1),\nfoo | bar');
  });

  it('strips exactly one leading space or tab per continuation line', () => {
    const [stanza] = parseDeb822('Files:\n  two spaces\n\ttab\n   three');
    expect(stanza!.fields.files).toBe('\n two spaces\ntab\n  three');
  });

  it('keeps the original spelling and looks fields up in lower case', () => {
    const [stanza] = parseDeb822('SHA256: abc\nX-Foo-Bar: 1');
    expect(stanza!.entries).toEqual([{ name: 'SHA256', value: 'abc' }, { name: 'X-Foo-Bar', value: '1' }]);
    expect(stanza!.fields.sha256).toBe('abc');
    expect(stanza!.fields['x-foo-bar']).toBe('1');
  });

  it('keeps every duplicate in entries and the last one in fields', () => {
    const [stanza] = parseDeb822('Tag: a\nTAG: b');
    expect(stanza!.entries).toEqual([{ name: 'Tag', value: 'a' }, { name: 'TAG', value: 'b' }]);
    expect(stanza!.fields.tag).toBe('b');
  });

  it('is safe with a field named __proto__', () => {
    const [stanza] = parseDeb822('__proto__: x');
    expect(stanza!.fields['__proto__']).toBe('x');
    expect(Object.getPrototypeOf(stanza!.fields)).toBeNull();
  });

  it('splits stanzas on one or more blank or whitespace-only lines', () => {
    expect(parseDeb822('A: 1\n\nA: 2\n\n\n  \t\nA: 3')).toHaveLength(3);
  });

  it('ignores a leading and a trailing run of blank lines', () => {
    expect(parseDeb822('\n\nA: 1\n\n\n')).toHaveLength(1);
  });

  it('accepts \\r\\n line endings', () => {
    const [stanza] = parseDeb822('A: 1\r\nB: x\r\n y\r\n\r\nC: 2\r\n');
    expect(stanza!.fields).toEqual({ a: '1', b: 'x\ny' });
    expect(parseDeb822('A: 1\r\n\r\nB: 2')).toHaveLength(2);
  });

  it('ignores comments without breaking a stanza or a continuation', () => {
    const stanzas = parseDeb822('# header\nA: x\n# in the middle\n y\nB: 2\n# between\n\n# lone comment\n\nC: 3');
    expect(stanzas).toHaveLength(2);
    expect(stanzas[0]!.fields).toEqual({ a: 'x\ny', b: '2' });
  });

  it('treats a line with spaces then # as a continuation, not a comment', () => {
    expect(parseDeb822('A: x\n # not a comment')[0]!.fields.a).toBe('x\n# not a comment');
  });

  it('returns no stanza for an empty or comment-only document', () => {
    expect(parseDeb822('')).toEqual([]);
    expect(parseDeb822('\n  \n')).toEqual([]);
    expect(parseDeb822('# nothing\n# here')).toEqual([]);
  });

  it('trims the value and keeps an empty one', () => {
    const [stanza] = parseDeb822('A:    spaced   \nB:\nC: x');
    expect(stanza!.fields).toEqual({ a: 'spaced', b: '', c: 'x' });
  });

  it('keeps a colon inside the value', () => {
    expect(parseDeb822('Homepage: https://example.org:8080/')[0]!.fields.homepage).toBe('https://example.org:8080/');
  });

  it('collects garbage lines in unparsed instead of throwing', () => {
    const [stanza] = parseDeb822('A: 1\nno colon here\nBad Name: x\n-dash: x\n  orphan\nB: 2');
    expect(stanza!.fields).toEqual({ a: '1\n orphan', b: '2' });
    expect(stanza!.unparsed).toEqual(['no colon here', 'Bad Name: x', '-dash: x']);
  });

  it('collects a continuation before any field in unparsed and still returns the stanza', () => {
    const stanzas = parseDeb822(' orphan\n\nA: 1');
    expect(stanzas).toHaveLength(2);
    expect(stanzas[0]!.entries).toEqual([]);
    expect(stanzas[0]!.unparsed).toEqual([' orphan']);
  });

  it('throws a SyntaxError with the line number in strict mode', () => {
    expect(() => parseDeb822('A: 1\nB: 2\ngarbage', { strict: true })).toThrow(SyntaxError);
    expect(() => parseDeb822('A: 1\nB: 2\ngarbage', { strict: true })).toThrow('line 3');
    expect(() => parseDeb822(' orphan', { strict: true })).toThrow('line 1');
  });

  it('accepts valid input in strict mode', () => {
    expect(parseDeb822(PACKAGES, { strict: true })).toHaveLength(2);
  });
});
