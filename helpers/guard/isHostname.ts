/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Options for {@link isHostname}.
 * @since 3.1.10
 */
export interface IsHostnameOptions {
  /** Accept one trailing dot (fully qualified name such as `example.com.`). Default `false`. */
  allowTrailingDot?: boolean;
  /** Accept `_` as a label character (service names such as `_dmarc.example.com`). Default `false`. */
  allowUnderscore?: boolean;
}

const MAX_LENGTH = 253;
const MAX_LABEL_LENGTH = 63;

/**
 * Checks whether a value is a syntactically valid DNS hostname (RFC 952, RFC 1123, RFC 3696 section 2).
 *
 * Rules:
 * - ASCII only: letters, digits and hyphens, case-insensitive.
 * - Labels are separated by dots and are 1 to 63 characters long. A label never starts or ends with a hyphen.
 * - The whole name is at most 253 characters (not counting an optional trailing dot).
 * - A single label is valid (`localhost`).
 * - The last label (the TLD) is never all digits (RFC 3696), so `192.168.0.1` and `123` are not hostnames.
 *   Other labels may be all digits.
 * - A trailing dot is refused unless `allowTrailingDot` is `true`.
 * - `_` is refused unless `allowUnderscore` is `true`; then it is accepted anywhere in a label, including
 *   at the start (`_dmarc`) and the end. The hyphen rules still apply.
 * - Unicode labels are refused. Punycode (`xn--...`) is ASCII and accepted. To check an internationalised
 *   name, convert it first with `new URL('https://' + name).hostname`.
 * - Whitespace, a port, a path or a scheme (`example.com:80`, `a/b`, `http://x`) make it invalid.
 *
 * It only checks the syntax: it does not resolve the name and does not check that the TLD exists.
 * It never throws and runs in linear time.
 *
 * @param value - The value to check
 * @param options - Optional switches for the trailing dot and the underscore
 * @returns `true` if value is a string that is a valid hostname
 * @example
 * isHostname('example.com')                                   // => true
 * isHostname('localhost')                                     // => true
 * isHostname('192.168.0.1')                                   // => false (numeric TLD)
 * isHostname('example.com.')                                  // => false
 * isHostname('example.com.', { allowTrailingDot: true })      // => true
 * isHostname('_dmarc.example.com', { allowUnderscore: true }) // => true
 * isHostname('example.com:80')                                // => false
 * @since 3.1.10
 */
export function isHostname(value: unknown, options: IsHostnameOptions = {}): value is string {
  if (typeof value !== 'string') return false;
  const { allowTrailingDot = false, allowUnderscore = false } = options;

  const end = allowTrailingDot && value.endsWith('.') ? value.length - 1 : value.length;
  if (end === 0 || end > MAX_LENGTH) return false;

  let labelStart = 0;
  let allDigits = true;
  // Index `end` acts as a virtual final dot that closes the last label.
  for (let i = 0; i <= end; i++) {
    const code = i < end ? value.charCodeAt(i) : 46;
    if (code === 46) {
      const length = i - labelStart;
      if (length === 0 || length > MAX_LABEL_LENGTH) return false;
      if (value.charCodeAt(labelStart) === 45 || value.charCodeAt(i - 1) === 45) return false;
      if (i === end && allDigits) return false;
      labelStart = i + 1;
      allDigits = true;
    } else if (code >= 48 && code <= 57) {
      // digit: keeps allDigits as is
    } else if ((code >= 97 && code <= 122) || (code >= 65 && code <= 90) || code === 45) {
      allDigits = false;
    } else if (code === 95 && allowUnderscore) {
      allDigits = false;
    } else {
      return false;
    }
  }
  return true;
}
