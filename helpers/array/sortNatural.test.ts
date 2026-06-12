/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import {
  createSortByNaturalFn,
  sortStringNaturalAscFn,
  sortStringNaturalAscInsensitiveFn,
  sortStringNaturalDescFn,
  sortStringNaturalDescInsensitiveFn,
} from './sortNatural';

describe('natural sort', () => {
  describe('sortStringNaturalAscFn', () => {
    it('numbers embedded in strings sort numerically', () => {
      const arr = ['W20', 'W2', 'W11', 'W01'];
      arr.sort(sortStringNaturalAscFn);
      expect(arr).toEqual(['W01', 'W2', 'W11', 'W20']);
    });

    it('plain strings still sort alphabetically', () => {
      const arr = ['banana', 'apple', 'cherry'];
      arr.sort(sortStringNaturalAscFn);
      expect(arr).toEqual(['apple', 'banana', 'cherry']);
    });

    it('handles mixed numeric magnitude', () => {
      const arr = ['file100', 'file9', 'file10', 'file2'];
      arr.sort(sortStringNaturalAscFn);
      expect(arr).toEqual(['file2', 'file9', 'file10', 'file100']);
    });

    it('handles leading zeros', () => {
      const arr = ['item003', 'item01', 'item002', 'item10'];
      arr.sort(sortStringNaturalAscFn);
      expect(arr).toEqual(['item01', 'item002', 'item003', 'item10']);
    });
  });

  describe('sortStringNaturalDescFn', () => {
    it('numbers sort in descending order', () => {
      const arr = ['W01', 'W2', 'W11', 'W20'];
      arr.sort(sortStringNaturalDescFn);
      expect(arr).toEqual(['W20', 'W11', 'W2', 'W01']);
    });
  });

  describe('sortStringNaturalAscInsensitiveFn', () => {
    it('case insensitive natural sort', () => {
      const arr = ['file10.txt', 'File2.txt', 'FILE1.txt'];
      arr.sort(sortStringNaturalAscInsensitiveFn);
      expect(arr).toEqual(['FILE1.txt', 'File2.txt', 'file10.txt']);
    });
  });

  describe('sortStringNaturalDescInsensitiveFn', () => {
    it('case insensitive descending natural sort', () => {
      const arr = ['FILE1.txt', 'File2.txt', 'file10.txt'];
      arr.sort(sortStringNaturalDescInsensitiveFn);
      expect(arr).toEqual(['file10.txt', 'File2.txt', 'FILE1.txt']);
    });

    it('W-series sorts in descending numeric order case-insensitively', () => {
      const arr = ['W01', 'w11', 'W2', 'w20'];
      arr.sort(sortStringNaturalDescInsensitiveFn);
      expect(arr).toEqual(['w20', 'w11', 'W2', 'W01']);
    });
  });

  describe('createSortByNaturalFn', () => {
    it('sorts objects by embedded numbers', () => {
      const items = [
        { code: 'W20' },
        { code: 'W2' },
        { code: 'W11' },
        { code: 'W01' },
      ];
      const sorted = [...items].sort(createSortByNaturalFn('code'));
      expect(sorted.map(i => i.code)).toEqual(['W01', 'W2', 'W11', 'W20']);
    });

    it('uses auto-detected default property', () => {
      const items = [{ value: 'item10' }, { value: 'item2' }, { value: 'item1' }];
      const sorted = [...items].sort(createSortByNaturalFn());
      expect(sorted.map(i => i.value)).toEqual(['item1', 'item2', 'item10']);
    });

    it('case insensitive option', () => {
      const items = [
        { label: 'Section10' },
        { label: 'section2' },
        { label: 'SECTION1' },
      ];
      const sorted = [...items].sort(createSortByNaturalFn('label', true));
      expect(sorted.map(i => i.label)).toEqual(['SECTION1', 'section2', 'Section10']);
    });

    it('no default property found, falls back to empty string comparison', () => {
      const items = [{ other: 'z' }, { other: 'a' }];
      const sorted = [...items].sort(createSortByNaturalFn());
      expect(sorted.length).toBe(2);
    });

    it('auto-detect path: null/undefined prop value falls back to empty string', () => {
      const items = [
        { value: null as any },
        { value: 'item2' },
        { value: undefined as any },
      ];
      const sorted = [...items].sort(createSortByNaturalFn());
      expect(sorted[sorted.length - 1].value).toBe('item2');
    });

    it('handles null/undefined property values', () => {
      const items = [
        { code: 'W2' },
        { code: null as unknown as string },
        { code: 'W1' },
      ];
      const sorted = [...items].sort(createSortByNaturalFn('code'));
      expect(sorted[0].code).toBeNull();
      expect(sorted[1].code).toBe('W1');
      expect(sorted[2].code).toBe('W2');
    });

    it('sorts by multiple keys — ties on first key broken by second', () => {
      const items = [
        { dept: 'B', code: 'W11' },
        { dept: 'A', code: 'W20' },
        { dept: 'B', code: 'W2' },
        { dept: 'A', code: 'W9' },
      ];
      const sorted = [...items].sort(createSortByNaturalFn(['dept', 'code'] as const));
      expect(sorted.map(i => `${i.dept}:${i.code}`)).toEqual([
        'A:W9', 'A:W20', 'B:W2', 'B:W11',
      ]);
    });

    it('[] as property array produces a stable no-op comparator', () => {
      const items = [{ code: 'W20' }, { code: 'W2' }];
      const sorted = [...items].sort(createSortByNaturalFn([] as const));
      expect(sorted.map(i => i.code)).toEqual(['W20', 'W2']);
    });
  });
});
