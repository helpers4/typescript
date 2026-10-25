/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { onPointerIntent } from './onPointerIntent';

function fire(target: Element, type: string, x = 0) {
  target.dispatchEvent(Object.assign(new Event(type), { clientX: x, clientY: 0, pointerId: 1, button: 0, pointerType: 'mouse' }));
}

const examples: HelperExamples = {
  helper: 'onPointerIntent',
  category: 'browser',
  examples: [
    {
      title: 'Tell a tap from a drag',
      description: 'A press released within the threshold is a tap; moving past it starts a drag.',
      code: `const stop = onPointerIntent(handle, {
  onTap: () => select(),
  onDrag: ({ dx, dy }) => move(dx, dy),
});
stop();`,
      assert: () => {
        const element = new EventTarget() as Element;
        const seen: string[] = [];
        onPointerIntent(element, { onTap: () => seen.push('tap'), onDrag: ({ dx }) => seen.push(`drag ${dx}`) });
        fire(element, 'pointerdown');
        fire(element, 'pointerup');
        fire(element, 'pointerdown');
        fire(element, 'pointermove', 10);
        fire(element, 'pointerup', 10);
        if (seen.join() !== 'tap,drag 10') throw new Error(`Expected tap then drag, got ${seen.join()}`);
      },
    },
    {
      title: 'Stop with an AbortSignal',
      description: 'One abort() removes the listeners, as on unmount.',
      code: `const controller = new AbortController();
onPointerIntent(handle, { onPress }, { signal: controller.signal });
controller.abort();`,
      assert: () => {
        const element = new EventTarget() as Element;
        const controller = new AbortController();
        let pressed = 0;
        onPointerIntent(element, { onPress: () => pressed++ }, { signal: controller.signal });
        controller.abort();
        fire(element, 'pointerdown');
        if (pressed !== 0) throw new Error('Expected no press after abort');
      },
    },
  ],
};

export default examples;
