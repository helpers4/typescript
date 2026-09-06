/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { truncate } from './truncate';

/**
 * Derives a short, readable excerpt from a longer text — for a card/header/preview where a full
 * paragraph doesn't fit. Unlike {@link truncate} (a mechanical cut at exactly `maxLength`), this
 * prefers to cut at the end of a whole sentence (`.`, `!`, or `?`) when one fits within
 * `maxLength`, even if that leaves the result shorter than the limit. Only when no sentence fits
 * does it fall back to the last whole word before the limit — it never returns partial-word text.
 *
 * Known limitation: the sentence-boundary check is a simple heuristic (punctuation followed by
 * whitespace or the end of the text) — it doesn't special-case abbreviations ("Mr.") or decimal
 * numbers ("3.14"), which can be misread as a sentence end.
 * @param text - The text to excerpt. Internal whitespace (line breaks, repeated spaces) is
 * collapsed to single spaces before measuring length.
 * @param maxLength - Maximum length of the result, including `ellipsis` when one is appended.
 * @param ellipsis - Appended only when falling back to a word-boundary cut (a sentence-boundary
 * cut never needs one). Defaults to `'…'`.
 * @returns The original text unchanged if already within `maxLength`, otherwise a shortened version
 * @example
 * excerpt('A short game about ducks.', 200)
 * // => 'A short game about ducks.'
 * @example
 * excerpt(
 *   'Build the biggest, best theme park rides ever seen. Can you make money in this business?',
 *   60,
 * )
 * // => 'Build the biggest, best theme park rides ever seen.'
 * @example
 * excerpt('This description has no punctuation at all so it must cut on a word', 30)
 * // => 'This description has no…'
 * @since next
 */
export function excerpt(text: string, maxLength: number, ellipsis = '…'): string {
  const collapsed = text.trim().replace(/\s+/g, ' ');
  if (collapsed.length <= maxLength) return collapsed;

  const window = collapsed.slice(0, maxLength);
  const sentenceEnd = window.search(/[.!?](?=\s|$)/);
  if (sentenceEnd !== -1) {
    return collapsed.slice(0, sentenceEnd + 1);
  }

  // No sentence boundary within range — cut at the last whole word instead, reserving room for
  // the ellipsis so the result never exceeds maxLength.
  const budget = Math.max(0, maxLength - ellipsis.length);
  const lastSpace = collapsed.slice(0, budget + 1).lastIndexOf(' ');
  if (lastSpace > 0) {
    return `${collapsed.slice(0, lastSpace).trimEnd()}${ellipsis}`;
  }

  // No word boundary at all within budget (one giant unbroken run of characters) — delegate to
  // truncate() for grapheme-cluster-safe cutting instead of naively slicing mid-character.
  return truncate(collapsed, maxLength, ellipsis);
}
