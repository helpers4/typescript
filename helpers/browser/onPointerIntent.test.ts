/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it, vi } from 'vitest';
import { onPointerIntent } from './onPointerIntent';

function fire(target: Element, type: string, init: { x?: number; y?: number; id?: number; button?: number; pointerType?: string } = {}) {
  const event = Object.assign(new Event(type), {
    clientX: init.x ?? 0,
    clientY: init.y ?? 0,
    pointerId: init.id ?? 1,
    button: init.button ?? 0,
    pointerType: init.pointerType ?? 'mouse',
  });
  target.dispatchEvent(event);
  return event;
}

function setup(options?: Parameters<typeof onPointerIntent>[2]) {
  const target = document.createElement('div');
  const handlers = {
    onHover: vi.fn(),
    onPress: vi.fn(),
    onTap: vi.fn(),
    onDragStart: vi.fn(),
    onDrag: vi.fn(),
    onDragEnd: vi.fn(),
    onCancel: vi.fn(),
  };
  const stop = onPointerIntent(target, handlers, options);
  return { target, handlers, stop };
}

describe('onPointerIntent', () => {
  it('reports a press then a tap when the pointer barely moves', () => {
    const { target, handlers } = setup();
    fire(target, 'pointerdown', { x: 10, y: 10 });
    expect(handlers.onPress).toHaveBeenCalledOnce();
    expect(handlers.onPress.mock.calls[0]![0]).toMatchObject({ x: 10, y: 10, startX: 10, startY: 10, dx: 0, dy: 0 });
    fire(target, 'pointermove', { x: 12, y: 11 });
    fire(target, 'pointerup', { x: 12, y: 11 });
    expect(handlers.onTap).toHaveBeenCalledOnce();
    expect(handlers.onTap.mock.calls[0]![0]).toMatchObject({ x: 12, y: 11, dx: 2, dy: 1 });
    expect(handlers.onDragStart).not.toHaveBeenCalled();
    expect(handlers.onDragEnd).not.toHaveBeenCalled();
  });

  it('turns into a drag once the threshold is passed, and ends it on release', () => {
    const { target, handlers } = setup();
    fire(target, 'pointerdown', { x: 0, y: 0 });
    fire(target, 'pointermove', { x: 4, y: 0 });
    expect(handlers.onDragStart).not.toHaveBeenCalled();
    fire(target, 'pointermove', { x: 6, y: 0 });
    expect(handlers.onDragStart).toHaveBeenCalledOnce();
    expect(handlers.onDrag).toHaveBeenCalledOnce();
    fire(target, 'pointermove', { x: 9, y: 3 });
    expect(handlers.onDragStart).toHaveBeenCalledOnce();
    expect(handlers.onDrag).toHaveBeenCalledTimes(2);
    expect(handlers.onDrag.mock.calls[1]![0]).toMatchObject({ dx: 9, dy: 3 });
    fire(target, 'pointerup', { x: 9, y: 3 });
    expect(handlers.onDragEnd).toHaveBeenCalledOnce();
    expect(handlers.onTap).not.toHaveBeenCalled();
  });

  it('honours a custom threshold', () => {
    const { target, handlers } = setup({ threshold: 20 });
    fire(target, 'pointerdown');
    fire(target, 'pointermove', { x: 15 });
    fire(target, 'pointerup', { x: 15 });
    expect(handlers.onTap).toHaveBeenCalledOnce();
  });

  it('ignores a move or a release without a press', () => {
    const { target, handlers } = setup();
    fire(target, 'pointermove', { x: 50 });
    fire(target, 'pointerup');
    fire(target, 'pointercancel');
    expect(Object.values(handlers).every((handler) => handler.mock.calls.length === 0)).toBe(true);
  });

  it('only follows the first pointer', () => {
    const { target, handlers } = setup();
    fire(target, 'pointerdown', { id: 1 });
    fire(target, 'pointerdown', { id: 2 });
    expect(handlers.onPress).toHaveBeenCalledOnce();
    fire(target, 'pointermove', { id: 2, x: 50 });
    fire(target, 'pointerup', { id: 2 });
    fire(target, 'pointercancel', { id: 2 });
    expect(handlers.onDragStart).not.toHaveBeenCalled();
    expect(handlers.onTap).not.toHaveBeenCalled();
    expect(handlers.onCancel).not.toHaveBeenCalled();
    fire(target, 'pointerup', { id: 1 });
    expect(handlers.onTap).toHaveBeenCalledOnce();
  });

  it('only presses with the wanted button', () => {
    const { target, handlers } = setup();
    fire(target, 'pointerdown', { button: 2 });
    expect(handlers.onPress).not.toHaveBeenCalled();
    const right = setup({ button: 2 });
    fire(right.target, 'pointerdown', { button: 2 });
    expect(right.handlers.onPress).toHaveBeenCalledOnce();
  });

  it('can start a new interaction after one ends', () => {
    const { target, handlers } = setup();
    fire(target, 'pointerdown');
    fire(target, 'pointerup');
    fire(target, 'pointerdown');
    fire(target, 'pointerup');
    expect(handlers.onTap).toHaveBeenCalledTimes(2);
  });

  it('reports a cancel, for a press and for a drag, and resets', () => {
    const { target, handlers } = setup();
    fire(target, 'pointerdown');
    fire(target, 'pointercancel');
    fire(target, 'pointerdown');
    fire(target, 'pointermove', { x: 30 });
    fire(target, 'pointercancel', { x: 30 });
    expect(handlers.onCancel).toHaveBeenCalledTimes(2);
    expect(handlers.onDragEnd).not.toHaveBeenCalled();
    fire(target, 'pointermove', { x: 90 });
    expect(handlers.onDrag).toHaveBeenCalledOnce();
  });

  it('reports hover for a mouse or a pen, not for touch', () => {
    const { target, handlers } = setup();
    fire(target, 'pointerenter', { x: 3, y: 4 });
    fire(target, 'pointerleave', { pointerType: 'pen' });
    fire(target, 'pointerenter', { pointerType: 'touch' });
    fire(target, 'pointerleave', { pointerType: 'touch' });
    expect(handlers.onHover.mock.calls.map(([hovering]) => hovering)).toEqual([true, false]);
    expect(handlers.onHover.mock.calls[0]![1]).toMatchObject({ x: 3, y: 4, startX: 3, startY: 4, dx: 0, dy: 0 });
  });

  it('works with no handler at all', () => {
    const target = document.createElement('div');
    onPointerIntent(target, {});
    expect(() => {
      fire(target, 'pointerenter');
      fire(target, 'pointerleave');
      fire(target, 'pointerdown');
      fire(target, 'pointermove', { x: 30 });
      fire(target, 'pointerup');
      fire(target, 'pointerdown');
      fire(target, 'pointerup');
      fire(target, 'pointerdown');
      fire(target, 'pointercancel');
    }).not.toThrow();
  });

  it('captures the pointer on press and releases it at the end, when the browser can', () => {
    const { target } = setup();
    const capture = vi.fn();
    const release = vi.fn();
    Object.assign(target, { setPointerCapture: capture, releasePointerCapture: release });
    fire(target, 'pointerdown', { id: 7 });
    fire(target, 'pointerup', { id: 7 });
    fire(target, 'pointerdown', { id: 8 });
    fire(target, 'pointercancel', { id: 8 });
    expect(capture.mock.calls).toEqual([[7], [8]]);
    expect(release.mock.calls).toEqual([[7], [8]]);
  });

  it('stops listening when stopped, and forgets the press', () => {
    const { target, handlers, stop } = setup();
    fire(target, 'pointerdown');
    stop();
    fire(target, 'pointermove', { x: 90 });
    fire(target, 'pointerup');
    fire(target, 'pointerenter');
    expect(handlers.onDragStart).not.toHaveBeenCalled();
    expect(handlers.onTap).not.toHaveBeenCalled();
    expect(handlers.onHover).not.toHaveBeenCalled();
  });

  it('stops listening when the signal aborts, and lets go of it when stopped', () => {
    const controller = new AbortController();
    const { target, handlers } = setup({ signal: controller.signal });
    controller.abort();
    fire(target, 'pointerdown');
    expect(handlers.onPress).not.toHaveBeenCalled();

    const other = new AbortController();
    const remove = vi.spyOn(other.signal, 'removeEventListener');
    setup({ signal: other.signal }).stop();
    expect(remove).toHaveBeenCalledOnce();
  });

  it('listens to nothing with an already aborted signal', () => {
    const controller = new AbortController();
    controller.abort();
    const target = document.createElement('div');
    const add = vi.spyOn(target, 'addEventListener');
    onPointerIntent(target, {}, { signal: controller.signal })();
    expect(add).not.toHaveBeenCalled();
  });

  it('does nothing on a target that cannot listen', () => {
    const stop = onPointerIntent({} as Element, { onTap: vi.fn() });
    expect(() => stop()).not.toThrow();
  });
});
