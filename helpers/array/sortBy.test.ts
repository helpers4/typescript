/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import {
  createSortByDateFn,
  createSortByNumberFn,
  createSortByStringFn,
} from './sortBy';

describe('createSortByStringFn', () => {
  const users = [
    { name: 'John', age: 30, joined: new Date('2020-01-01') },
    { name: 'alice', age: 25, joined: new Date('2021-01-01') },
    { name: 'Bob', age: 35, joined: new Date('2019-01-01') },
  ];

  it('should sort by string property', () => {
    const sorted = [...users].sort(createSortByStringFn('name'));
    expect(sorted.map(u => u.name)).toEqual(['alice', 'Bob', 'John']);
  });

  it('should sort by string property case insensitive', () => {
    const sorted = [...users].sort(createSortByStringFn('name', true));
    expect(sorted.map(u => u.name)).toEqual(['alice', 'Bob', 'John']);
  });

  it('should use default properties (value first)', () => {
    const items = [{ value: 'z' }, { value: 'a' }, { value: 'c' }];
    const sorted = [...items].sort(createSortByStringFn());
    expect(sorted.map(i => i.value)).toEqual(['a', 'c', 'z']);
  });

  it('should fallback to label when all objects have label', () => {
    const items = [{ label: 'z' }, { label: 'a' }, { label: 'c' }];
    const sorted = [...items].sort(createSortByStringFn());
    expect(sorted.map(i => i.label)).toEqual(['a', 'c', 'z']);
  });

  it('should fallback to title', () => {
    const items = [{ title: 'z' }, { title: 'a' }, { title: 'c' }];
    const sorted = [...items].sort(createSortByStringFn());
    expect(sorted.map(i => i.title)).toEqual(['a', 'c', 'z']);
  });

  it('should fallback to description', () => {
    const items = [{ description: 'z' }, { description: 'a' }, { description: 'c' }];
    const sorted = [...items].sort(createSortByStringFn());
    expect(sorted.map(i => i.description)).toEqual(['a', 'c', 'z']);
  });

  it('should handle null/undefined property values', () => {
    const items = [
      { name: 'John' },
      { name: null as any },
      { name: undefined as any },
      { name: 'Alice' },
    ];
    const sorted = [...items].sort(createSortByStringFn('name'));
    expect(sorted[0].name ?? '').toBe('');
    expect(sorted[1].name ?? '').toBe('');
    expect(sorted[2].name).toBe('Alice');
    expect(sorted[3].name).toBe('John');
  });

  it('should not match default property when only one item has it', () => {
    const items = [
      { value: 'z', label: 'first' },
      { label: 'second' },
    ];
    const sorted = [...items].sort(createSortByStringFn());
    expect(sorted[0]).toEqual({ value: 'z', label: 'first' });
    expect(sorted[1]).toEqual({ label: 'second' });
  });

  it('should sort by multiple keys (primary, then secondary)', () => {
    const items = [
      { dept: 'B', name: 'Alice' },
      { dept: 'A', name: 'Zoe' },
      { dept: 'B', name: 'Adam' },
      { dept: 'A', name: 'Anna' },
    ];
    const sorted = [...items].sort(createSortByStringFn(['dept', 'name'] as const));
    expect(sorted.map(i => `${i.dept}:${i.name}`)).toEqual([
      'A:Anna', 'A:Zoe', 'B:Adam', 'B:Alice',
    ]);
  });

  it('should sort by multiple keys with case insensitive', () => {
    const items = [
      { dept: 'b', name: 'alice' },
      { dept: 'A', name: 'Zoe' },
      { dept: 'B', name: 'adam' },
      { dept: 'a', name: 'anna' },
    ];
    const sorted = [...items].sort(createSortByStringFn(['dept', 'name'] as const, true));
    expect(sorted.map(i => i.name)).toEqual(['anna', 'Zoe', 'adam', 'alice']);
  });

  it('handles equal string values', () => {
    const items = [{ value: 'a' }, { value: 'a' }, { value: 'a' }];
    const sorted = [...items].sort(createSortByStringFn());
    expect(sorted.map(i => i.value)).toEqual(['a', 'a', 'a']);
  });

  it('returns 0 when no default property found in either object', () => {
    const items = [{ other: 'z' }, { other: 'a' }];
    const sorted = [...items].sort(createSortByStringFn());
    expect(sorted.length).toBe(2);
  });

  it('auto-detect with case insensitive', () => {
    const items = [{ value: 'Zebra' }, { value: 'apple' }, { value: 'Banana' }];
    const sorted = [...items].sort(createSortByStringFn(undefined, true));
    expect(sorted.map(i => i.value)).toEqual(['apple', 'Banana', 'Zebra']);
  });

  it('auto-detect path: null/undefined prop value falls back to empty string', () => {
    const items = [
      { value: null as any },
      { value: 'hello' },
      { value: undefined as any },
    ];
    const sorted = [...items].sort(createSortByStringFn());
    // null/undefined → '', which sorts before 'hello'
    expect(sorted[sorted.length - 1].value).toBe('hello');
  });
});

describe('createSortByNumberFn', () => {
  it('should sort by number property', () => {
    const users = [{ age: 30 }, { age: 25 }, { age: 35 }];
    const sorted = [...users].sort(createSortByNumberFn('age'));
    expect(sorted.map(u => u.age)).toEqual([25, 30, 35]);
  });

  it('should use default number property', () => {
    const items = [{ value: 30 }, { value: 10 }, { value: 20 }];
    const sorted = [...items].sort(createSortByNumberFn());
    expect(sorted.map(i => i.value)).toEqual([10, 20, 30]);
  });

  it('missing property defaults to 0', () => {
    const items = [{ score: 5 }, {}] as { score?: number }[];
    expect(items.sort(createSortByNumberFn('score'))).toEqual([{}, { score: 5 }]);
  });

  it('handles numeric comparison (not lexical)', () => {
    const items = [{ value: 200 }, { value: 10 }, { value: 100 }];
    const sorted = [...items].sort(createSortByNumberFn('value'));
    expect(sorted[0].value).toBe(10);
    expect(sorted[1].value).toBe(100);
    expect(sorted[2].value).toBe(200);
  });

  it('null/undefined value falls back to 0 for both a and b', () => {
    const items = [
      { score: null as any },
      { score: 5 },
      { score: undefined as any },
    ];
    const sorted = [...items].sort(createSortByNumberFn('score'));
    expect(sorted[0].score ?? 0).toBe(0);
    expect(sorted[1].score ?? 0).toBe(0);
    expect(sorted[2].score).toBe(5);
  });

  it('NaN value is treated as 0 — comparator never returns NaN', () => {
    const items = [{ value: NaN }, { value: 5 }, { value: 1 }];
    const sorted = [...items].sort(createSortByNumberFn('value'));
    expect(sorted.map(i => i.value)).toHaveLength(3);
    expect(isNaN(sorted[0].value) || sorted[0].value === 0).toBe(true);
    expect(sorted[sorted.length - 1].value).toBe(5);
  });

  it('NaN as first argument (a) is normalized to 0', () => {
    const cmp = createSortByNumberFn('value');
    expect(cmp({ value: NaN }, { value: 5 })).toBe(-1);
    expect(cmp({ value: NaN }, { value: -3 })).toBe(1);
    expect(cmp({ value: NaN }, { value: NaN })).toBe(0);
  });

  it('Infinity sorts after finite values, -Infinity before them — comparator never returns NaN', () => {
    const items = [{ value: Infinity }, { value: 5 }, { value: -Infinity }, { value: 1 }];
    const sorted = [...items].sort(createSortByNumberFn('value'));
    expect(sorted).toHaveLength(4);
    expect(sorted[0].value).toBe(-Infinity);
    expect(sorted[sorted.length - 1].value).toBe(Infinity);
  });
});

describe('createSortByDateFn', () => {
  it('should sort by date property', () => {
    const items = [
      { joined: new Date('2021-01-01') },
      { joined: new Date('2020-01-01') },
      { joined: new Date('2019-01-01') },
    ];
    const sorted = [...items].sort(createSortByDateFn('joined'));
    expect(sorted.map(u => u.joined.getFullYear())).toEqual([2019, 2020, 2021]);
  });

  it('should use default date property', () => {
    const items = [
      { date: new Date('2022-01-01') },
      { date: new Date('2021-01-01') },
      { date: new Date('2023-01-01') },
    ];
    const sorted = [...items].sort(createSortByDateFn());
    expect(sorted.map(i => i.date.getFullYear())).toEqual([2021, 2022, 2023]);
  });

  it('sorts by date string property ascending', () => {
    const items = [
      { date: '2023-06-01' },
      { date: '2021-01-01' },
      { date: '2022-03-15' },
    ];
    expect(items.sort(createSortByDateFn())).toEqual([
      { date: '2021-01-01' },
      { date: '2022-03-15' },
      { date: '2023-06-01' },
    ]);
  });

  it('empty array returns []', () => {
    expect([].sort(createSortByDateFn())).toEqual([]);
  });

  it('invalid date string is treated as epoch — comparator never returns NaN', () => {
    const items = [
      { date: 'not-a-date' },
      { date: '2024-01-01' },
      { date: '2020-06-15' },
    ];
    const sorted = [...items].sort(createSortByDateFn());
    expect(sorted).toHaveLength(3);
    expect(sorted[sorted.length - 1].date).toBe('2024-01-01');
  });

  it('invalid date in both positions — directly invoke comparator to cover all NaN branches', () => {
    const cmp = createSortByDateFn();
    // b is invalid (bRaw = NaN → 0): valid date vs invalid
    expect(cmp({ date: '2024-01-01' }, { date: 'bad' })).toBeGreaterThan(0);
    // a is invalid (aRaw = NaN → 0): invalid date vs valid
    expect(cmp({ date: 'bad' }, { date: '2024-01-01' })).toBeLessThan(0);
    // missing property (??0 branch): epoch (0) vs valid date
    expect(cmp({}, { date: '2024-01-01' })).toBeLessThan(0);
    expect(cmp({ date: '2024-01-01' }, {})).toBeGreaterThan(0);
  });

  it('sort descending via reversed comparator', () => {
    const items = [
      { timestamp: new Date('2023-01-01') },
      { timestamp: new Date('2021-01-01') },
      { timestamp: new Date('2022-01-01') },
    ];
    const sorted = [...items].sort((a, b) => createSortByDateFn('timestamp')(b, a));
    expect(sorted[0].timestamp.getFullYear()).toBe(2023);
    expect(sorted[1].timestamp.getFullYear()).toBe(2022);
    expect(sorted[2].timestamp.getFullYear()).toBe(2021);
  });
});

describe('createSortByStringFn — empty property array', () => {
  it('[] produces a stable no-op comparator (does not fall back to auto-detect)', () => {
    const items = [{ value: 'z' }, { value: 'a' }, { value: 'm' }];
    const sorted = [...items].sort(createSortByStringFn([] as const));
    // All comparisons return 0 → original order preserved
    expect(sorted.map(i => i.value)).toEqual(['z', 'a', 'm']);
  });
});

describe('createSortByStringFn — reuse', () => {
  it('reusing the same comparator on arrays with different schemas sorts each correctly', () => {
    const sorter = createSortByStringFn();
    const first = [{ value: 'b' }, { value: 'a' }];
    first.sort(sorter);
    expect(first.map(i => i.value)).toEqual(['a', 'b']);

    const second = [{ label: 'z' }, { label: 'm' }, { label: 'a' }];
    second.sort(sorter);
    expect(second.map(i => i.label)).toEqual(['a', 'm', 'z']);
  });
});
