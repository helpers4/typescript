/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * One field of a deb822 stanza, with the name spelled as in the source.
 * @since next
 */
export interface Deb822Field {
  /** The field name, in its original case (`Package`, `SHA256`, `X-Foo`). */
  name: string;
  /** The field value; a multi-line value keeps its line breaks, joined with `\n`. */
  value: string;
}

/**
 * One stanza (paragraph) of a deb822 document.
 *
 * `entries` is the faithful, ordered record: every field, in source order, with its original
 * spelling, duplicates included. `fields` is the convenient view for lookups. It is keyed by the
 * lower-cased name because Debian field names are case-insensitive (Policy 5.1), so a lookup is
 * `stanza.fields[name.toLowerCase()]`, and a plain object stays serialisable and diff-friendly,
 * where a `get()` method would not survive `JSON.stringify` or a structured clone.
 * @since next
 */
export interface Deb822Stanza {
  /** Every field in source order, original spelling, duplicates kept. */
  entries: Deb822Field[];
  /** The values keyed by lower-cased name; when a name repeats, the last value wins. */
  fields: Record<string, string>;
  /** The lines that are neither a field nor a continuation of one (always empty in strict mode). */
  unparsed: string[];
}

/**
 * Options for {@link parseDeb822}.
 * @since next
 */
export interface Deb822Options {
  /** Throw a `SyntaxError` on a line that is not a field, instead of collecting it in `unparsed`. Defaults to `false`. */
  strict?: boolean;
}

const FIELD_RE = /^([^\s:#-][^\s:]*):(.*)$/;

/**
 * Parses a deb822 document, the format of Debian `Packages`, `Sources` and `Release` indexes,
 * `control` and `.dsc` and `.changes` files, DEP-5 `copyright` files and apt `.sources` files, as
 * described in the Debian Policy Manual, chapter 5.1 "Syntax of control files".
 *
 * - Stanzas are separated by one or more blank lines (lines holding only whitespace).
 * - A field is `Name: value`. The value has its surrounding whitespace removed. Names are
 *   case-insensitive in Debian: the original spelling is kept in `entries`, and `fields` is keyed
 *   by the lower-cased name.
 * - A line starting with a space or a tab continues the previous field. Exactly one leading
 *   space or tab is removed, the line breaks are kept (joined with `\n`), and a continuation line
 *   that is just `.` stands for an empty line. A field whose first line is empty (`Files:`) keeps
 *   that empty first line, so its value starts with `\n`.
 * - Lines starting with `#` are comments and are ignored anywhere, without ending a stanza or a
 *   multi-line value. `\r\n` line endings are accepted. Trailing whitespace is dropped.
 * - A repeated field name inside one stanza: all occurrences stay in `entries`, and the last one
 *   wins in `fields`.
 * - A line that is not a comment, a field or a continuation (no colon, a continuation before any
 *   field, a name with a space before the colon) never throws by default: it is collected in the
 *   stanza's `unparsed`, so nothing is lost silently. With `{ strict: true }` it throws a
 *   `SyntaxError` naming the line number and its text instead. A stanza made only of such lines
 *   is still returned.
 * - PGP clearsigning armor (`Release`, `.dsc`, `.changes` can be signed) is not interpreted.
 *
 * To compare the version strings found in `Version` fields, use `compare(a, b, 'debian')` from
 * `@helpers4/version`; to read `Depends`-like fields, use `parseRelationships`.
 *
 * @param text - The document, with `\n` or `\r\n` line endings
 * @param options - `{ strict }`, see {@link Deb822Options}
 * @returns The stanzas in source order; `[]` for an empty or comment-only document
 * @throws {SyntaxError} In strict mode, when a line is not valid deb822
 *
 * @example
 * ```ts
 * const [pkg] = parseDeb822('Package: zlib1g\nDescription: compression library\n - runtime\n .\n more');
 * pkg.fields.package;     // 'zlib1g'
 * pkg.fields.description; // 'compression library\n- runtime\n\nmore'
 * pkg.entries[0];         // { name: 'Package', value: 'zlib1g' }
 * ```
 *
 * @since next
 */
export function parseDeb822(text: string, options: Deb822Options = {}): Deb822Stanza[] {
  const stanzas: Deb822Stanza[] = [];
  let entries: Deb822Field[] = [];
  let unparsed: string[] = [];
  let name = '';
  let parts: string[] | undefined;

  const endField = (): void => {
    if (parts) entries.push({ name, value: parts.join('\n') });
    parts = undefined;
  };
  const endStanza = (): void => {
    endField();
    if (entries.length > 0 || unparsed.length > 0) {
      const fields: Record<string, string> = Object.create(null) as Record<string, string>;
      for (const entry of entries) fields[entry.name.toLowerCase()] = entry.value;
      stanzas.push({ entries, fields, unparsed });
    }
    entries = [];
    unparsed = [];
  };

  const lines = text.split(/\r?\n/);
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]!.trimEnd();
    if (line === '') {
      endStanza();
      continue;
    }
    if (line[0] === '#') continue;
    if (line[0] === ' ' || line[0] === '\t') {
      if (parts) {
        const rest = line.slice(1);
        parts.push(rest === '.' ? '' : rest);
        continue;
      }
    } else {
      const match = FIELD_RE.exec(line);
      if (match) {
        endField();
        name = match[1]!;
        parts = [match[2]!.trim()];
        continue;
      }
    }
    if (options.strict) {
      throw new SyntaxError(`parseDeb822: line ${index + 1} is not a field or a continuation: "${line}"`);
    }
    unparsed.push(line);
  }
  endStanza();
  return stanzas;
}
