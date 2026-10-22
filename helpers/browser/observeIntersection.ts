/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Calls `callback` each time `element` enters or leaves the viewport (or `options.root`), with an
 * `IntersectionObserver` dedicated to it: lazy loading, starting an animation when it becomes
 * visible, pausing a video when it scrolls away. Like `IntersectionObserver` itself, it is also
 * called once soon after it starts observing.
 *
 * Without `IntersectionObserver`, it does nothing and returns a function that does nothing.
 *
 * @param element - The element to observe
 * @param callback - Receives the `IntersectionObserverEntry` of `element` (`entry.isIntersecting`, `entry.intersectionRatio`, ...)
 * @param options - `root`, `rootMargin` and `threshold`, as for `IntersectionObserver`
 * @returns A function that stops observing
 * @example
 * const stop = observeIntersection(video, (entry) => (entry.isIntersecting ? video.play() : video.pause()));
 * @example
 * // Load once, when 200px away from the viewport
 * const stop = observeIntersection(image, (entry) => {
 *   if (!entry.isIntersecting) return;
 *   image.src = image.dataset.src!;
 *   stop();
 * }, { rootMargin: '200px' });
 * @since next
 */
export function observeIntersection(
  element: Element,
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit,
): () => void {
  if (typeof globalThis.IntersectionObserver !== 'function') return () => {};
  const observer = new globalThis.IntersectionObserver((entries) => {
    for (const entry of entries) callback(entry);
  }, options);
  observer.observe(element);
  return () => observer.disconnect();
}
