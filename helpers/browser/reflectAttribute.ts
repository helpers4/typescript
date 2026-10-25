/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Options for {@link reflectAttribute}.
 * @since next
 */
export interface ReflectAttributeOptions {
  /**
   * How the value is stored in the attribute:
   * - `'string'` (default): the attribute text;
   * - `'number'`: parsed with `Number`, `NaN` when it is not a number;
   * - `'boolean'`: `true` when the attribute is present (whatever its value), like `hidden` or `disabled`.
   */
  type?: 'string' | 'number' | 'boolean';
  /** The attribute name. Defaults to the property name in lowercase. */
  attribute?: string;
  /** What the property reads when the attribute is missing (`'string'` and `'number'` only). Defaults to `''` for a string and `0` for a number. */
  defaultValue?: string | number;
}

/**
 * Defines a property on `element` that is backed by an HTML attribute — what a custom element
 * needs for `<my-card heading="…" count="3" selected>`, in one line. Reading parses the attribute
 * by `type`; writing stores it (a boolean toggles the attribute, `null` or `undefined` removes it).
 * The attribute stays the single source of truth, so `setAttribute` and the property never disagree.
 *
 * It defines an own property on the instance, so call it once per element (in a constructor or
 * `connectedCallback`). Calling it again for the same property replaces the previous definition.
 *
 * @param element - The element that gets the property
 * @param property - The property name, e.g. `'heading'`
 * @param options - Type, attribute name and default — see {@link ReflectAttributeOptions}
 * @returns A function that removes the property again
 * @example
 * reflectAttribute(card, 'count', { type: 'number' });
 * card.count = 3;           // <my-card count="3">
 * card.getAttribute('count') // => '3'
 * @example
 * reflectAttribute(card, 'selected', { type: 'boolean' });
 * card.selected = true;     // <my-card selected="">
 * @since next
 */
export function reflectAttribute(element: Element, property: string, options: ReflectAttributeOptions = {}): () => void {
  const { type = 'string', attribute = property.toLowerCase() } = options;
  const defaultValue = options.defaultValue ?? (type === 'number' ? 0 : '');

  Object.defineProperty(element, property, {
    configurable: true,
    enumerable: true,
    get(): string | number | boolean {
      if (type === 'boolean') return element.hasAttribute(attribute);
      const raw = element.getAttribute(attribute);
      if (raw === null) return defaultValue;
      return type === 'number' ? Number(raw) : raw;
    },
    set(value: string | number | boolean | null | undefined) {
      if (type === 'boolean') element.toggleAttribute(attribute, Boolean(value));
      else if (value === null || value === undefined) element.removeAttribute(attribute);
      else element.setAttribute(attribute, String(value));
    },
  });

  return () => {
    Reflect.deleteProperty(element, property);
  };
}
