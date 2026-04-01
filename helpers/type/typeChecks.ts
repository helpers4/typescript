/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Type for values that can be T, undefined, or null
 */
export type Maybe<T> = T | undefined | null;

/**
 * Checks if a value is set (not undefined nor null)
 * @param value - The value to check
 * @returns True if value is not undefined nor null
 */
export function isSet<T>(value: Maybe<T>): value is T {
  return value !== undefined && value !== null;
}

/**
 * Checks if a value is a string
 * @param value - The value to check
 * @returns True if value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Checks if a value is a number
 * @param value - The value to check
 * @returns True if value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Checks if a value is a boolean
 * @param value - The value to check
 * @returns True if value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Checks if a value is an array
 * @param value - The value to check
 * @returns True if value is an array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Checks if a value is a plain object
 * @param value - The value to check
 * @returns True if value is a plain object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Checks if a value is a function
 * @param value - The value to check
 * @returns True if value is a function
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

/**
 * Checks if a value is a Date
 * @param value - The value to check
 * @returns True if value is a Date
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Checks if a string is a valid regex
 * @param value - The string to check
 * @returns True if the string is a valid regex pattern
 */
export function isValidRegex(value: string): boolean {
  try {
    new RegExp(value);
    return true;
  } catch {
    return false;
  }
}
