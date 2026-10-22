/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Calls `callback` each time the size of `element` changes, with a `ResizeObserver` dedicated to
 * it. Like `ResizeObserver` itself, it is also called once soon after it starts observing.
 *
 * To limit how often it runs, wrap the callback with `debounce` or `throttle` from
 * `helpers4/function`. Without `ResizeObserver`, it does nothing and returns a function that
 * does nothing.
 *
 * @param element - The element to observe
 * @param callback - Receives the `ResizeObserverEntry` of `element`
 * @returns A function that stops observing
 * @example
 * const stop = observeResize(canvas, (entry) => redraw(entry.contentRect));
 * stop();
 * @since next
 */
export function observeResize(element: Element, callback: (entry: ResizeObserverEntry) => void): () => void {
  if (typeof globalThis.ResizeObserver !== 'function') return () => {};
  const observer = new globalThis.ResizeObserver((entries) => {
    for (const entry of entries) callback(entry);
  });
  observer.observe(element);
  return () => observer.disconnect();
}
