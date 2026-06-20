/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SORT_STRING_PROPS,
  buildCollatorCompareFn,
  getStringCollator,
  getStringCollatorInsensitive,
  normalizePropertyToKeys,
} from './_sortHelpers';

describe('DEFAULT_SORT_STRING_PROPS', () => {
  it('contains the expected keys in order', () => {
    expect(DEFAULT_SORT_STRING_PROPS).toEqual(['value', 'label', 'title', 'description']);
  });
});

describe('getStringCollator', () => {
  it('returns the same instance on repeated calls (singleton)', () => {
    expect(getStringCollator()).toBe(getStringCollator());
  });

  it('compares strings with case and accent sensitivity', () => {
    // 'é' should differ from 'e' (variant sensitivity)
    expect(getStringCollator().compare('é', 'e')).not.toBe(0);
    // 'A' should differ from 'a'
    expect(getStringCollator().compare('A', 'a')).not.toBe(0);
  });
});

describe('getStringCollatorInsensitive', () => {
  it('returns the same instance on repeated calls (singleton)', () => {
    expect(getStringCollatorInsensitive()).toBe(getStringCollatorInsensitive());
  });

  it('treats uppercase and lowercase as equal (accent sensitivity)', () => {
    expect(getStringCollatorInsensitive().compare('A', 'a')).toBe(0);
  });

  it('still distinguishes accented characters', () => {
    // accent sensitivity: é ≠ e
    expect(getStringCollatorInsensitive().compare('é', 'e')).not.toBe(0);
  });
});

describe('normalizePropertyToKeys', () => {
  it('returns undefined when property is undefined', () => {
    expect(normalizePropertyToKeys<{ a: string }>(undefined)).toBeUndefined();
  });

  it('wraps a single key in an array', () => {
    expect(normalizePropertyToKeys<{ a: string }>('a')).toEqual(['a']);
  });

  it('returns an array unchanged', () => {
    expect(normalizePropertyToKeys<{ a: string; b: string }>(['a', 'b'] as const)).toEqual(['a', 'b']);
  });

  it('returns an empty array unchanged (no-op signal)', () => {
    expect(normalizePropertyToKeys<{ a: string }>([] as const)).toEqual([]);
  });
});

describe('buildCollatorCompareFn', () => {
  const collator = new Intl.Collator(undefined, { sensitivity: 'variant' });

  it('sorts by explicit key', () => {
    type Row = { name: string };
    const fn = buildCollatorCompareFn<Row>(collator, ['name']);
    const items: Row[] = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];
    expect([...items].sort(fn).map((r) => r.name)).toEqual(['Alice', 'Bob', 'Charlie']);
  });

  it('returns 0 for equal values', () => {
    type Row = { name: string };
    const fn = buildCollatorCompareFn<Row>(collator, ['name']);
    expect(fn({ name: 'Alice' }, { name: 'Alice' })).toBe(0);
  });

  it('breaks ties on the second key when multiple keys given', () => {
    type Row = { dept: string; name: string };
    const fn = buildCollatorCompareFn<Row>(collator, ['dept', 'name']);
    const items: Row[] = [
      { dept: 'Eng', name: 'Zara' },
      { dept: 'Eng', name: 'Alice' },
      { dept: 'Art', name: 'Bob' },
    ];
    const sorted = [...items].sort(fn);
    expect(sorted[0]).toEqual({ dept: 'Art', name: 'Bob' });
    expect(sorted[1]).toEqual({ dept: 'Eng', name: 'Alice' });
    expect(sorted[2]).toEqual({ dept: 'Eng', name: 'Zara' });
  });

  it('auto-detects from DEFAULT_SORT_STRING_PROPS when keys is undefined', () => {
    type Row = { label: string };
    const fn = buildCollatorCompareFn<Row>(collator, undefined);
    const items: Row[] = [{ label: 'Charlie' }, { label: 'Alice' }];
    expect([...items].sort(fn).map((r) => r.label)).toEqual(['Alice', 'Charlie']);
  });

  it('auto-detect tiebreaks on all shared DEFAULT_SORT_STRING_PROPS keys in order', () => {
    // Both rows share 'value' (equal) and 'label' (different) — should tiebreak on 'label'
    type Row = { value: string; label: string };
    const fn = buildCollatorCompareFn<Row>(collator, undefined);
    const items: Row[] = [
      { value: 'same', label: 'Zara' },
      { value: 'same', label: 'Alice' },
    ];
    expect([...items].sort(fn).map((r) => r.label)).toEqual(['Alice', 'Zara']);
  });

  it('auto-detect ignores inherited properties (only own properties trigger detection)', () => {
    // Object.hasOwn — inherited value/label on the prototype must NOT trigger auto-detect
    type Row = Record<string, unknown>;
    const proto = { label: 'should-be-ignored' };
    const a: Row = Object.create(proto) as Row;
    const b: Row = Object.create(proto) as Row;
    a['label'] = 'Zara';
    b['label'] = 'Alice';
    const fn = buildCollatorCompareFn<Row>(collator, undefined);
    // Both own 'label' → auto-detect fires → sorts Alice before Zara
    expect([a, b].sort(fn).map((r) => r['label'])).toEqual(['Alice', 'Zara']);

    // Prototype-only: neither owns 'label' → auto-detect does NOT fire → stable no-op
    const c: Row = Object.create(proto) as Row;
    const d: Row = Object.create(proto) as Row;
    const fn2 = buildCollatorCompareFn<Row>(collator, undefined);
    expect([c, d].sort(fn2)).toEqual([c, d]);
  });

  it('produces no-op comparator for empty keys array (does not fall back to auto-detect)', () => {
    type Row = { label: string };
    const fn = buildCollatorCompareFn<Row>(collator, []);
    const items: Row[] = [{ label: 'Charlie' }, { label: 'Alice' }];
    // Sort is stable no-op — order preserved
    expect([...items].sort(fn).map((r) => r.label)).toEqual(['Charlie', 'Alice']);
  });
});
