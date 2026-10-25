/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { HelperExamples } from '../../scripts/examples/types';
import { reflectAttribute } from './reflectAttribute';

/** A minimal element: examples run in Node, without a DOM. */
class FakeElement {
  private attributes = new Map<string, string>();
  getAttribute(name: string) { return this.attributes.get(name) ?? null; }
  setAttribute(name: string, value: string) { this.attributes.set(name, value); }
  removeAttribute(name: string) { this.attributes.delete(name); }
  hasAttribute(name: string) { return this.attributes.has(name); }
  toggleAttribute(name: string, force: boolean) { if (force) this.attributes.set(name, ''); else this.attributes.delete(name); }
}
const makeCard = <T>() => new FakeElement() as unknown as Element & T;

const examples: HelperExamples = {
  helper: 'reflectAttribute',
  category: 'browser',
  examples: [
    {
      title: 'A number property backed by an attribute',
      description: 'Writing the property sets the attribute, and setAttribute is seen by the property.',
      code: `reflectAttribute(card, 'count', { type: 'number' });
card.count = 3;
card.getAttribute('count') // => '3'`,
      assert: () => {
        const card = makeCard<{ count: number }>();
        reflectAttribute(card, 'count', { type: 'number' });
        card.count = 3;
        if (card.getAttribute('count') !== '3') throw new Error('Expected the attribute to be 3');
        card.setAttribute('count', '5');
        if (card.count !== 5) throw new Error('Expected the property to read 5');
      },
    },
    {
      title: 'A boolean property is the presence of the attribute',
      description: 'Like hidden or disabled: true adds the attribute, false removes it.',
      code: `reflectAttribute(card, 'selected', { type: 'boolean' });
card.selected = true;
card.hasAttribute('selected') // => true`,
      assert: () => {
        const card = makeCard<{ selected: boolean }>();
        reflectAttribute(card, 'selected', { type: 'boolean' });
        card.selected = true;
        if (!card.hasAttribute('selected')) throw new Error('Expected the attribute');
        card.selected = false;
        if (card.hasAttribute('selected')) throw new Error('Expected no attribute');
      },
    },
  ],
};

export default examples;
