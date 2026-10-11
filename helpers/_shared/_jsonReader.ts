/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 *
 * Internal JSON / JSON5 reader shared by `json/parse` (JSON5) and the `guard/isJson5` and
 * `guard/isIJson` guards. Written from the JSON5 1.0.0 specification (https://spec.json5.org)
 * and RFC 7493 (I-JSON), not from any existing implementation. Not exported from any package
 * barrel — tests live in _jsonReader.test.ts.
 */

/**
 * Which grammar {@link readJson} reads:
 * - `'json5'` — JSON5 1.0.0, a superset of JSON (and of JSONC)
 * - `'json'` — strict JSON (RFC 8259), exactly what `JSON.parse` accepts
 * @ignore
 */
export type JsonDialect = 'json5' | 'json';

/** @ignore */
export interface ReadJsonOptions {
  dialect: JsonDialect;
  /**
   * Also enforce I-JSON (RFC 7493) on top of the grammar: no duplicate object keys, no lone
   * surrogate or noncharacter in strings, and no number beyond what a double holds exactly.
   */
  iJson?: boolean;
}

/** JSON5 whitespace: JSON's four, plus VT, FF, NBSP, LS, PS, BOM and every Unicode space separator. @ignore */
const JSON5_SPACE = /[\t\n\v\f\r \u00A0\u2028\u2029\uFEFF\p{Zs}]/u;
/** @ignore */
const LINE_TERMINATOR = /[\n\r\u2028\u2029]/;
/** First character of an unquoted JSON5 key (ECMAScript IdentifierStart). @ignore */
const IDENTIFIER_START = /[\p{ID_Start}$_]/u;
/** Any later character of an unquoted JSON5 key (ECMAScript IdentifierPart). @ignore */
const IDENTIFIER_PART = /[\p{ID_Continue}$\u200C\u200D]/u;
/** @ignore */
const HEX_DIGIT = /[0-9A-Fa-f]/;
/** A lone surrogate or a Unicode noncharacter, which I-JSON forbids in strings. @ignore */
const I_JSON_FORBIDDEN =
  /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]|[\uFDD0-\uFDEF\uFFFE\uFFFF]|[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDFFE\uDFFF]/;
/** A double has 15 to 17 significant decimal digits; more than 17 expresses precision it can't hold. @ignore */
const MAX_SIGNIFICANT_DIGITS = 17;

/** @ignore */
function isDigit(char: string | undefined): boolean {
  return char !== undefined && char >= '0' && char <= '9';
}

/** 1-based line and column of `index` in `text`; `\r\n` counts as one line break. @ignore */
function position(text: string, index: number): string {
  let line = 1;
  let lineStart = 0;
  for (let k = 0; k < index; k++) {
    const char = text[k];
    if (char === '\n' || char === '\u2028' || char === '\u2029' || (char === '\r' && text[k + 1] !== '\n')) {
      line++;
      lineStart = k + 1;
    }
  }
  return `line ${line}, column ${index - lineStart + 1}`;
}

/** Defines `key` like `JSON.parse` does: `__proto__` becomes an own property, never the prototype. @ignore */
function define(object: Record<string, unknown>, key: string, value: unknown): void {
  if (key === '__proto__') {
    Object.defineProperty(object, key, { value, writable: true, enumerable: true, configurable: true });
  } else {
    object[key] = value;
  }
}

/**
 * Reads one JSON or JSON5 value from `text`, the whole of it, and throws a `SyntaxError` naming
 * the line and column of the first problem otherwise. Builds values the way `JSON.parse` does
 * (same numbers, `__proto__` as an own property, the last of duplicate keys wins unless `iJson`).
 * @ignore
 */
export function readJson(text: string, { dialect, iJson = false }: ReadJsonOptions): unknown {
  const json5 = dialect === 'json5';
  let i = 0;

  const fail = (message: string, at: number = i): never => {
    throw new SyntaxError(`parse: ${message} at ${position(text, at)}`);
  };
  const unexpected = (): never =>
    i >= text.length ? fail('unexpected end of input') : fail(`unexpected character ${JSON.stringify(text[i])}`);

  const isSpace = (char: string): boolean =>
    json5 ? JSON5_SPACE.test(char) : char === ' ' || char === '\t' || char === '\n' || char === '\r';

  const skipSpace = (): void => {
    while (i < text.length) {
      const char = text[i]!;
      if (isSpace(char)) {
        i++;
      } else if (json5 && char === '/' && text[i + 1] === '/') {
        i += 2;
        while (i < text.length && !LINE_TERMINATOR.test(text[i]!)) i++;
      } else if (json5 && char === '/' && text[i + 1] === '*') {
        const end = text.indexOf('*/', i + 2);
        if (end === -1) fail('unterminated block comment');
        i = end + 2;
      } else {
        return;
      }
    }
  };

  const hexDigits = (count: number): number => {
    const start = i;
    for (let k = 0; k < count; k++) {
      if (!HEX_DIGIT.test(text[i] ?? '')) unexpected();
      i++;
    }
    return Number.parseInt(text.slice(start, i), 16);
  };

  const literal = <T>(word: string, result: T): T => {
    for (const expected of word) {
      if (text[i] !== expected) unexpected();
      i++;
    }
    return result;
  };

  const checkIJsonNumber = (raw: string, parsed: number, at: number): void => {
    if (!Number.isFinite(parsed)) fail(`number ${raw} is beyond the range of a double (I-JSON)`, at);
    const mantissa = raw.replace(/^[+-]/, '').split(/[eE]/)[0]!.replace('.', '');
    const significant = mantissa.replace(/^0+/, '').replace(/0+$/, '');
    if (significant.length > MAX_SIGNIFICANT_DIGITS || (parsed === 0 && significant !== '')) {
      fail(`number ${raw} is more precise than a double holds (I-JSON)`, at);
    }
    if (/^-?\d+$/.test(raw) && !Number.isSafeInteger(parsed)) {
      fail(`integer ${raw} is outside the exact range of a double (I-JSON)`, at);
    }
  };

  const number = (): number => {
    const start = i;
    let sign = 1;
    if (text[i] === '-' || (json5 && text[i] === '+')) {
      if (text[i] === '-') sign = -1;
      i++;
    }
    if (json5) {
      if (text.startsWith('Infinity', i)) return sign * literal('Infinity', Infinity);
      if (text.startsWith('NaN', i)) return literal('NaN', Number.NaN);
      if (text[i] === '0' && (text[i + 1] === 'x' || text[i + 1] === 'X')) {
        i += 2;
        const digitsStart = i;
        while (HEX_DIGIT.test(text[i] ?? '')) i++;
        if (i === digitsStart) unexpected();
        return sign * Number.parseInt(text.slice(digitsStart, i), 16);
      }
    }

    const integerStart = i;
    if (text[i] === '0') {
      i++;
    } else {
      while (isDigit(text[i])) i++;
    }
    const hasInteger = i > integerStart;
    if (!hasInteger && !(json5 && text[i] === '.')) unexpected();
    if (text[i] === '.') {
      i++;
      const fractionStart = i;
      while (isDigit(text[i])) i++;
      // JSON needs digits after the dot; JSON5 also allows "1." but not a bare ".".
      if (i === fractionStart && (!json5 || !hasInteger)) unexpected();
    }
    if (text[i] === 'e' || text[i] === 'E') {
      i++;
      if (text[i] === '+' || text[i] === '-') i++;
      const exponentStart = i;
      while (isDigit(text[i])) i++;
      if (i === exponentStart) unexpected();
    }
    const raw = text.slice(start, i);
    const parsed = Number(raw.replace(/^\+/, ''));
    if (iJson) checkIJsonNumber(raw, parsed, start);
    return parsed;
  };

  const escape = (): string => {
    i++; // the backslash
    const char = text[i];
    switch (char) {
      case '"':
      case '\\':
      case '/':
        i++;
        return char;
      case 'b':
        i++;
        return '\b';
      case 'f':
        i++;
        return '\f';
      case 'n':
        i++;
        return '\n';
      case 'r':
        i++;
        return '\r';
      case 't':
        i++;
        return '\t';
      case 'u':
        i++;
        return String.fromCharCode(hexDigits(4));
    }
    if (!json5 || char === undefined || (isDigit(char) && char !== '0')) return unexpected();
    i++;
    switch (char) {
      case 'v':
        return '\v';
      case '0':
        if (isDigit(text[i])) unexpected();
        return '\0';
      case 'x':
        return String.fromCharCode(hexDigits(2));
      case '\r':
        if (text[i] === '\n') i++;
        return '';
      case '\n':
      case '\u2028':
      case '\u2029':
        return '';
      default:
        // JSON5 NonEscapeCharacter: any other character stands for itself (`\'`, `\a`, …).
        return char;
    }
  };

  const string = (quote: string): string => {
    const start = i;
    i++;
    let result = '';
    for (;;) {
      const char = text[i];
      if (char === undefined) fail('unterminated string', start);
      if (char === quote) break;
      if (char === '\\') {
        result += escape();
      } else {
        // JSON forbids every raw control character; JSON5 only forbids the line breaks.
        if (char === '\n' || char === '\r' || (!json5 && char! < ' ')) unexpected();
        result += char;
        i++;
      }
    }
    i++;
    if (iJson && I_JSON_FORBIDDEN.test(result)) {
      fail('string holds a lone surrogate or a noncharacter (I-JSON)', start);
    }
    return result;
  };

  const identifier = (): string => {
    let name = '';
    for (;;) {
      const pattern = name === '' ? IDENTIFIER_START : IDENTIFIER_PART;
      if (text[i] === '\\') {
        const at = i;
        i++;
        if (text[i] !== 'u') unexpected();
        i++;
        const char = String.fromCharCode(hexDigits(4));
        if (!pattern.test(char)) fail(`invalid key character ${JSON.stringify(char)}`, at);
        name += char;
      } else {
        const codePoint = text.codePointAt(i);
        const char = codePoint === undefined ? '' : String.fromCodePoint(codePoint);
        if (char === '' || !pattern.test(char)) break;
        name += char;
        i += char.length;
      }
    }
    if (name === '') unexpected();
    return name;
  };

  const key = (): string => {
    if (text[i] === '"') return string('"');
    if (!json5) return unexpected();
    return text[i] === "'" ? string("'") : identifier();
  };

  // `value` and the two container readers call each other, so they're hoisted declarations.
  function object(): Record<string, unknown> {
    i++;
    const result: Record<string, unknown> = {};
    const seen = iJson ? new Set<string>() : undefined;
    skipSpace();
    if (text[i] === '}') {
      i++;
      return result;
    }
    for (;;) {
      const keyStart = i;
      const name = key();
      if (seen) {
        if (seen.has(name)) fail(`duplicate key ${JSON.stringify(name)} (I-JSON)`, keyStart);
        seen.add(name);
      }
      skipSpace();
      if (text[i] !== ':') unexpected();
      i++;
      skipSpace();
      define(result, name, value());
      skipSpace();
      if (text[i] === ',') {
        i++;
        skipSpace();
        if (json5 && text[i] === '}') break;
      } else if (text[i] === '}') {
        break;
      } else {
        unexpected();
      }
    }
    i++;
    return result;
  }

  function array(): unknown[] {
    i++;
    const result: unknown[] = [];
    skipSpace();
    if (text[i] === ']') {
      i++;
      return result;
    }
    for (;;) {
      result.push(value());
      skipSpace();
      if (text[i] === ',') {
        i++;
        skipSpace();
        if (json5 && text[i] === ']') break;
      } else if (text[i] === ']') {
        break;
      } else {
        unexpected();
      }
    }
    i++;
    return result;
  }

  function value(): unknown {
    switch (text[i]) {
      case '{':
        return object();
      case '[':
        return array();
      case '"':
        return string('"');
      case "'":
        return json5 ? string("'") : unexpected();
      case 't':
        return literal('true', true);
      case 'f':
        return literal('false', false);
      case 'n':
        return literal('null', null);
      default:
        return number();
    }
  }

  skipSpace();
  if (i >= text.length) unexpected();
  const result = value();
  skipSpace();
  if (i < text.length) unexpected();
  return result;
}
