/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Sort function type for arrays
 * @since 1.9.0
 */
export type SortFn<T> = (a: T, b: T) => number;

/**
 * Sort numbers in ascending order
 * @param a - First number
 * @param b - Second number
 * @returns Sort order
 * @since 1.9.0
 */
export const sortNumberAscFn: SortFn<number> = (a: number, b: number) => a - b;

/**
 * Sort numbers in descending order
 * @param a - First number
 * @param b - Second number
 * @returns Sort order
 * @since 1.9.0
 */
export const sortNumberDescFn: SortFn<number> = (a: number, b: number) => b - a;

/**
 * Sort strings in ascending order
 * @param a - First string
 * @param b - Second string
 * @returns Sort order
 * @since 1.9.0
 */
export const sortStringAscFn: SortFn<string> = (a: string, b: string) => a.localeCompare(b);

/**
 * Sort strings in descending order
 * @param a - First string
 * @param b - Second string
 * @returns Sort order
 * @since 1.9.0
 */
export const sortStringDescFn: SortFn<string> = (a: string, b: string) => b.localeCompare(a);

/**
 * Sort strings in ascending order (case insensitive)
 * @param a - First string
 * @param b - Second string
 * @returns Sort order
 * @since 1.9.0
 */
export const sortStringAscInsensitiveFn: SortFn<string> = (a: string, b: string) =>
  a.toLowerCase().localeCompare(b.toLowerCase());

/**
 * Creates a sort function for objects by string property
 * @param property - The property to sort by (defaults to trying 'value', 'label', 'title', 'description')
 * @param caseInsensitive - Whether to ignore case
 * @returns Sort function
 * @since 1.9.0
 */
export function createSortByStringFn<T extends Record<string, unknown>>(
  property?: keyof T,
  caseInsensitive: boolean = false
): SortFn<T> {
  return (a: T, b: T) => {
    let aVal = '';
    let bVal = '';

    if (property) {
      aVal = String(a[property] ?? '');
      bVal = String(b[property] ?? '');
    } else {
      // Try default properties in order
      for (const prop of ['value', 'label', 'title', 'description']) {
        if (prop in a && prop in b) {
          aVal = String(a[prop] ?? '');
          bVal = String(b[prop] ?? '');
          break;
        }
      }
    }

    return caseInsensitive
      ? aVal.toLowerCase().localeCompare(bVal.toLowerCase())
      : aVal.localeCompare(bVal);
  };
}

/**
 * Creates a sort function for objects by number property
 * @param property - The property to sort by (defaults to 'value')
 * @returns Sort function
 * @since 1.9.0
 */
export function createSortByNumberFn<T extends Record<string, unknown>>(
  property?: keyof T
): SortFn<T> {
  const prop = property || 'value';
  return (a: T, b: T) => {
    const aVal = Number(a[prop] ?? 0);
    const bVal = Number(b[prop] ?? 0);
    return aVal - bVal;
  };
}

/**
 * Creates a sort function for objects by date property
 * @param property - The property to sort by (defaults to 'date')
 * @returns Sort function
 * @since 1.9.0
 */
export function createSortByDateFn<T extends Record<string, unknown>>(
  property?: keyof T
): SortFn<T> {
  const prop = property || 'date';
  return (a: T, b: T) => {
    const aVal = new Date(a[prop] as string | number | Date).getTime();
    const bVal = new Date(b[prop] as string | number | Date).getTime();
    return aVal - bVal;
  };
}
