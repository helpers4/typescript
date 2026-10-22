/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Physical parameters of a {@link spring}, as design tools (Figma, Framer, ...) expose them.
 * @since 3.1.5
 */
export interface SpringOptions {
  /** Mass of the moving object. Defaults to `1`; must be positive. */
  mass?: number;
  /** Stiffness of the spring: higher is faster. Defaults to `100`; must be positive. */
  stiffness?: number;
  /** Friction: higher oscillates less. Defaults to `10`; must be positive. */
  damping?: number;
  /** Starting speed toward the target, in progress per second. Defaults to `0`. */
  initialVelocity?: number;
}

/**
 * A spring animation from `0` to `1`, created by {@link spring}.
 * @since 3.1.5
 */
export interface Spring {
  /** Time until the spring settles: from then on it stays within `0.001` of `1`. */
  readonly durationMs: number;
  /** Progress at `timeMs` milliseconds: `0` at the start, exactly `1` from {@link durationMs} on. It may exceed `1` while oscillating. */
  at(timeMs: number): number;
  /** The same curve as an easing function over `[0, 1]` (the fraction of {@link durationMs}), for {@link toCssLinear} or an animation library. */
  easing(t: number): number;
}

const REST = 0.001;

/**
 * Simulates a damped spring going from `0` to `1`, the curve behind "spring" transitions of
 * design tools, and computes how long it takes to settle.
 *
 * The motion is solved exactly (under-, critically or over-damped), not by stepping a
 * simulation, so `at` can be called at any time, in any order.
 *
 * @param options - Mass, stiffness, damping, initial velocity — see {@link SpringOptions}
 * @returns A {@link Spring}
 * @throws {RangeError} If `mass`, `stiffness` or `damping` is not positive, or `initialVelocity` is not finite
 * @example
 * const bouncy = spring({ stiffness: 300, damping: 15 });
 * element.animate({ transform: ['scale(0)', 'scale(1)'] }, {
 *   duration: bouncy.durationMs,
 *   easing: toCssLinear(bouncy.easing),
 * });
 * @since 3.1.5
 */
export function spring(options: SpringOptions = {}): Spring {
  const { mass = 1, stiffness = 100, damping = 10, initialVelocity = 0 } = options;
  if (!(mass > 0 && stiffness > 0 && damping > 0 && Number.isFinite(initialVelocity) && Number.isFinite(mass * stiffness * damping))) {
    throw new RangeError('spring: mass, stiffness and damping must be positive, and initialVelocity finite');
  }
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));

  // Displacement from the target (1 at the start, 0 at rest) after s seconds, and an upper
  // bound of its absolute value that only decreases once below 1, to find when it settles.
  let displacement: (s: number) => number;
  let envelope: (s: number) => number;
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    const b = (zeta * w0 - initialVelocity) / wd;
    displacement = (s) => Math.exp(-zeta * w0 * s) * (Math.cos(wd * s) + b * Math.sin(wd * s));
    envelope = (s) => Math.exp(-zeta * w0 * s) * Math.hypot(1, b);
  } else if (zeta === 1) {
    const b = w0 - initialVelocity;
    displacement = (s) => (1 + b * s) * Math.exp(-w0 * s);
    envelope = (s) => (1 + Math.abs(b) * s) * Math.exp(-w0 * s);
  } else {
    const root = w0 * Math.sqrt(zeta * zeta - 1);
    const slow = -zeta * w0 + root;
    const fast = -zeta * w0 - root;
    const c2 = (-initialVelocity - slow) / (fast - slow);
    const c1 = 1 - c2;
    displacement = (s) => c1 * Math.exp(slow * s) + c2 * Math.exp(fast * s);
    envelope = (s) => (Math.abs(c1) + Math.abs(c2)) * Math.exp(slow * s);
  }

  // Past `end`, the envelope is below REST; walk back to the last moment the motion was not.
  let end = 1;
  while (envelope(end / 1000) >= REST) end *= 2;
  const step = Math.max(1, Math.ceil(end / 10_000));
  let last = end;
  while (last > 0 && Math.abs(displacement(last / 1000)) < REST) last -= step;
  const durationMs = Math.max(last + step, 1);

  const at = (timeMs: number) => {
    if (timeMs <= 0) return 0;
    if (timeMs >= durationMs) return 1;
    return 1 - displacement(timeMs / 1000);
  };
  return { durationMs, at, easing: (t) => at(t * durationMs) };
}
