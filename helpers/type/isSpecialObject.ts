/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Determines if a value is a special object that should not have its properties compared deeply.
 * Special objects include: Date, Function, Promise, Observable, RegExp, Error, Map, Set, WeakMap, WeakSet, etc.
 * 
 * @param value - The value to check
 * @returns `true` if the value is a special object, `false` otherwise
 * @since 2.0.0
 */
export function isSpecialObject(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  // Functions are special objects
  if (typeof value === 'function') {
    return true;
  }

  // Non-objects are not special
  if (typeof value !== 'object') {
    return false;
  }

  // Arrays are not considered special objects for our purposes
  if (Array.isArray(value)) {
    return false;
  }

  // Check for built-in special objects
  if (
    value instanceof Date ||
    value instanceof Promise ||
    value instanceof RegExp ||
    value instanceof Error ||
    value instanceof Map ||
    value instanceof Set ||
    value instanceof WeakMap ||
    value instanceof WeakSet ||
    value instanceof ArrayBuffer ||
    value instanceof DataView
  ) {
    return true;
  }

  // Check for Observable (RxJS or similar)
  if (value.constructor?.name === 'Observable') {
    return true;
  }

  // Check for DOM elements (if in browser environment)
  if (typeof HTMLElement !== 'undefined' && value instanceof HTMLElement) {
    return true;
  }

  // Check for other built-in types by constructor name
  const constructorName = value.constructor?.name;
  if (constructorName && [
    'Buffer',       // Node.js Buffer
    'URL',          // Web URL API
    'URLSearchParams',
    'File',         // Web File API
    'Blob',         // Web Blob API
    'FormData',     // Web FormData API
    'Headers',      // Web Headers API
    'Request',      // Web Request API
    'Response',     // Web Response API
    'EventTarget',  // Web EventTarget API
    'Symbol'        // Symbol objects
  ].includes(constructorName)) {
    return true;
  }

  return false;
}
