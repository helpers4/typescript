/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { onAbort } from '../_shared/_onAbort.js';
import type { AbortSignalLike } from '../type/AbortSignalLike';

/**
 * What a pointer is doing, passed to the handlers of {@link onPointerIntent}.
 * @since 3.1.8
 */
export interface PointerIntent {
  /** The DOM event that triggered the handler. */
  event: PointerEvent;
  /** Where the pointer is, in client coordinates. */
  x: number;
  y: number;
  /** Where the press started, in client coordinates. Equal to `x`/`y` for `onHover`. */
  startX: number;
  startY: number;
  /** Movement since the press started: `x - startX` and `y - startY`. */
  dx: number;
  dy: number;
}

/**
 * Handlers for {@link onPointerIntent}; every one is optional.
 * @since 3.1.8
 */
export interface PointerIntentHandlers {
  /** A mouse or pen enters (`true`) or leaves (`false`) the target. Not called for touch. */
  onHover?: (hovering: boolean, intent: PointerIntent) => void;
  /** The pointer is pressed on the target. */
  onPress?: (intent: PointerIntent) => void;
  /** The pointer is released without having moved more than the threshold: a tap or a click. */
  onTap?: (intent: PointerIntent) => void;
  /** The pointer moved more than the threshold while pressed: a drag starts. */
  onDragStart?: (intent: PointerIntent) => void;
  /** The pointer moves during a drag (also called right after `onDragStart`). */
  onDrag?: (intent: PointerIntent) => void;
  /** The pointer is released after a drag. */
  onDragEnd?: (intent: PointerIntent) => void;
  /** The system cancelled the interaction (`pointercancel`, lost capture, scrolling takeover). Called once, for a press or a drag. */
  onCancel?: (intent: PointerIntent) => void;
}

/**
 * Options for {@link onPointerIntent}.
 * @since 3.1.8
 */
export interface PointerIntentOptions {
  /** Distance in pixels the pointer must travel while pressed before a tap becomes a drag. Defaults to `4`. */
  threshold?: number;
  /** The button that presses: `0` primary (default), `1` auxiliary, `2` secondary. */
  button?: number;
  /** Stops listening when aborted. */
  signal?: AbortSignalLike;
}

/**
 * Tells a tap from a drag, and hover from touch, on one element: the pointer-event logic every
 * draggable or clickable widget rewrites. Press, then either release within `threshold` pixels
 * (`onTap`) or move past it (`onDragStart`, `onDrag`…, `onDragEnd`).
 *
 * Only the first pointer that presses is followed (multi-touch ignores the others), and it is
 * captured with `setPointerCapture` so a drag keeps going outside the element — which means the
 * element receives the `pointerup` even when released elsewhere. Without pointer events (no
 * `addEventListener` on `target`), it does nothing and returns a function that does nothing.
 *
 * @param target - The element to listen on
 * @param handlers - What to do for each intent — see {@link PointerIntentHandlers}
 * @param options - Threshold, button and cancellation — see {@link PointerIntentOptions}
 * @returns A function that stops listening
 * @example
 * const stop = onPointerIntent(handle, {
 *   onTap: () => select(),
 *   onDrag: ({ dx, dy }) => move(dx, dy),
 * });
 * stop();
 * @since 3.1.8
 */
export function onPointerIntent(
  target: Element,
  handlers: PointerIntentHandlers,
  options: PointerIntentOptions = {},
): () => void {
  const { threshold = 4, button = 0, signal } = options;
  if (typeof target.addEventListener !== 'function' || signal?.aborted) return () => {};

  let pointerId: number | null = null;
  let startX = 0;
  let startY = 0;
  let dragging = false;

  const intent = (event: PointerEvent): PointerIntent => ({
    event,
    x: event.clientX,
    y: event.clientY,
    startX: pointerId === null ? event.clientX : startX,
    startY: pointerId === null ? event.clientY : startY,
    dx: pointerId === null ? 0 : event.clientX - startX,
    dy: pointerId === null ? 0 : event.clientY - startY,
  });

  const release = (event: PointerEvent): void => {
    target.releasePointerCapture?.(event.pointerId);
  };

  const finish = (): void => {
    pointerId = null;
    dragging = false;
  };

  const listeners: Record<string, (event: PointerEvent) => void> = {
    pointerenter: (event) => {
      if (event.pointerType !== 'touch') handlers.onHover?.(true, intent(event));
    },
    pointerleave: (event) => {
      if (event.pointerType !== 'touch') handlers.onHover?.(false, intent(event));
    },
    pointerdown: (event) => {
      if (pointerId !== null || event.button !== button) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      target.setPointerCapture?.(event.pointerId);
      handlers.onPress?.(intent(event));
    },
    pointermove: (event) => {
      if (event.pointerId !== pointerId) return;
      if (!dragging) {
        if (Math.hypot(event.clientX - startX, event.clientY - startY) <= threshold) return;
        dragging = true;
        handlers.onDragStart?.(intent(event));
      }
      handlers.onDrag?.(intent(event));
    },
    pointerup: (event) => {
      if (event.pointerId !== pointerId) return;
      const wasDragging = dragging;
      const info = intent(event);
      release(event);
      finish();
      if (wasDragging) handlers.onDragEnd?.(info);
      else handlers.onTap?.(info);
    },
    pointercancel: (event) => {
      if (event.pointerId !== pointerId) return;
      const info = intent(event);
      release(event);
      finish();
      handlers.onCancel?.(info);
    },
  };

  const names = Object.keys(listeners);
  for (const name of names) target.addEventListener(name, listeners[name] as EventListener);
  const stop = (): void => {
    removeListener();
    for (const name of names) target.removeEventListener(name, listeners[name] as EventListener);
    finish();
  };
  const removeListener = onAbort(signal, stop);
  return stop;
}
